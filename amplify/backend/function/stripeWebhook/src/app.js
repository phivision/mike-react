/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MIKE_REACT9AA15861_BUCKETNAME
Amplify Params - DO NOT EDIT */
const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const v5 = require("uuid/v5");
const prices = require("./prices").prices;
const asyncHandler = require("express-async-handler");

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

let stripe;
let ENDPOINT_SECRET;
let CONNECT_SECRET;
let UUID = "d2b157d4-5a66-49ca-b868-c83008f1e126";

if (process.env.ENV === "prod") {
  stripe = require("stripe")(
    "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"
  );
  ENDPOINT_SECRET = "whsec_QlApDvB6XPkqQEZv40xzjrLBUMu7mENM";
  CONNECT_SECRET = "whsec_1UVRXpjEK7waebehSsr0ujUXWDRWNup7";
} else {
  if (process.env.ENV === "dev") {
    ENDPOINT_SECRET = "whsec_DjCSZgxymENwj2yF0iAyIUKsJ1da0kIO";
    CONNECT_SECRET = "whsec_cmRg2kJ0dxuJZPDfaJgivyf7mf7bZZJl";
  } else {
    ENDPOINT_SECRET = "whsec_XMAGthm9Glxu8vSlrdYNDHMZ36LSmOvu";
    CONNECT_SECRET = "whsec_fRhIhpQ2H22msNN5HXWVwX3jjp5LmBnk";
  }
  stripe = require("stripe")(
    "sk_test_51IWoNlAXegvVyt5s8RgdmlA7kMtgxRkk5ckcNHQYVjgTyMCxKHDlgJm810tTm3KIVXe34FvDSlnsqzigH25AwsLU00nIkry9yo"
  );
}

const queryByStripeID = async (stripeID) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: "profilesByStripeID",
    KeyConditionExpression: "StripeID = :s",
    ExpressionAttributeValues: {
      ":s": stripeID,
    },
  };

  return await docClient.query(params).promise();
};

const setVerified = async (id) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: id,
    },
    UpdateExpression: "set #s = :d",
    ExpressionAttributeNames: {
      "#s": "IsVerified",
    },
    ExpressionAttributeValues: {
      ":d": true,
    },
    ReturnValues: "ALL_NEW",
  };

  return await docClient.update(params).promise();
};

const addTokens = async (userID, currentTokenCount, amount) => {
  let curr = currentTokenCount ? currentTokenCount : 0;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: userID,
    },
    UpdateExpression: "set #s = :d",
    ExpressionAttributeNames: {
      "#s": "TokenBalance",
    },
    ExpressionAttributeValues: {
      ":d": curr + amount,
    },
    ReturnValues: "ALL_NEW",
  };

  return await docClient.update(params).promise();
};

const createSubscription = async (
  trainerID,
  userID,
  subscriptionID,
  expireDate
) => {
  const i = v5(trainerID + userID, UUID);
  const time = new Date();
  const expire = new Date(expireDate * 1000).toISOString();
  const exp = expire.slice(0, 10);
  const params = {
    TableName: process.env.SUB_TABLE_NAME,
    Item: {
      id: i,
      __typename: "UserSubscriptionTrainer",
      createdAt: time.toISOString(),
      CancelAtPeriodEnd: false,
      userSubscriptionTrainerTrainerId: trainerID,
      userSubscriptionTrainerUserId: userID,
      StripeID: subscriptionID,
      ExpireDate: exp,
      updatedAt: time.toISOString(),
    },
  };

  return await docClient.put(params).promise();
};

const deleteSubscription = async (trainerID, userID) => {
  const i = v5(trainerID + userID, UUID);
  console.log(i);
  const params = {
    TableName: process.env.SUB_TABLE_NAME,
    Key: { id: i },
  };

  return await docClient.delete(params).promise();
};

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
          await setVerified(user.Items[0].id);
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
            trainer.Items[0].id,
            customer.Items[0].id,
            sub.id,
            sub.current_period_end
          ),
          addTokens(customer.Items[0].id, customer.Items[0].TokenBalance, 10),
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
        await deleteSubscription(train.Items[0].id, cus.Items[0].id);

        res.json({ received: true });
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const c = await queryByStripeID(paymentIntent.customer);

        await addTokens(
          c.Items[0].id,
          c.Items[0].TokenBalance,
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
