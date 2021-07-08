/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const prices = require("./prices").prices;
const AWS = require("aws-sdk");
const asyncHandler = require("express-async-handler");
const {
  queryByStripeID,
  setVerified,
  addTokens,
  createSubscription,
  deleteSubscription,
} = require("./requests");

// declare a new express app
const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());
app.use(bodyParser.raw({ type: "application/json" }));

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

let stripe, ENDPOINT_SECRET, CONNECT_SECRET;

app.use(
  asyncHandler(async (req, res, next) => {
    const { Parameters } = await new AWS.SSM()
      .getParameters({
        Names: [
          "STRIPE_SECRET_KEY",
          "STRIPE_ENDPOINT_SECRET",
          "STRIPE_CONNECT_ENDPOINT_SECRET",
        ].map((secretName) => process.env[secretName]),
        WithDecryption: true,
      })
      .promise();

    const secretKey = Parameters.find(
      (e) => e.Name === process.env.STRIPE_SECRET_KEY
    );

    stripe = require("stripe")(secretKey.Value);

    ENDPOINT_SECRET = Parameters.find(
      (e) => e.Name === process.env.STRIPE_ENDPOINT_SECRET
    ).Value;

    CONNECT_SECRET = Parameters.find(
      (e) => e.Name === process.env.STRIPE_CONNECT_ENDPOINT_SECRET
    ).Value;

    next();
  })
);

app.post(
  "/stripe/webhook/connect",
  asyncHandler(async (req, res, next) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        CONNECT_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "account.updated":
        const account = event.data.object;
        if (
          account.requirements.currently_due.length === 0 &&
          account.requirements.pending_verification.length === 0
        ) {
          const user = await queryByStripeID(account.id);
          await setVerified(user.items[0].id);
          res.json({ received: true });
        } else {
          res.json({ received: true });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        res.json({ received: true });
    }
  })
);

app.post(
  "/stripe/webhook",
  asyncHandler(async (req, res, next) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        ENDPOINT_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "invoice.paid":
        const invoice = event.data.object;

        const [customer, trainer, sub] = await Promise.all([
          queryByStripeID(invoice.customer),
          queryByStripeID(invoice.transfer_data.destination),
          stripe.subscriptions.retrieve(invoice.subscription),
        ]);

        await Promise.all([
          createSubscription(
            trainer.items[0].id,
            customer.items[0].id,
            sub.id,
            sub.current_period_end
          ),
          addTokens(customer.items[0].id, customer.items[0].TokenBalance, 10),
        ]);

        res.json({ received: true });
        break;

      case "customer.subscription.deleted":
        const subscription = event.data.object;
        const [cus, price] = await Promise.all([
          queryByStripeID(subscription.customer),
          stripe.prices.retrieve(subscription.plan.id),
        ]);

        const train = await queryByStripeID(price.lookup_key);
        await deleteSubscription(train.items[0].id, cus.items[0].id);

        res.json({ received: true });
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const c = await queryByStripeID(paymentIntent.customer);

        if (paymentIntent.transfer_data) {
          res.json({ received: true });
          break;
        }
        await addTokens(
          c.items[0].id,
          c.items[0].TokenBalance,
          parseInt(
            Object.keys(prices).find(
              (key) => prices[key] === paymentIntent.amount
            )
          )
        );

        res.json({ received: true });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        // Return a response to acknowledge receipt of the event
        res.json({ received: true });
    }
  })
);

app.use(function (req, res, next) {
  console.log("Route not found.");
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
