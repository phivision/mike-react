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

// declare a new express app
const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

let stripe;
let ENDPOINT_SECRET;
let UUID = "d2b157d4-5a66-49ca-b868-c83008f1e126";

if (process.env.ENV === "prod") {
  stripe = require("stripe")(
    "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"
  );
  ENDPOINT_SECRET = "whsec_QlApDvB6XPkqQEZv40xzjrLBUMu7mENM";
} else {
  if (process.env.ENV === "dev") {
    ENDPOINT_SECRET = "whsec_DjCSZgxymENwj2yF0iAyIUKsJ1da0kIO";
  } else {
    ENDPOINT_SECRET = "whsec_XMAGthm9Glxu8vSlrdYNDHMZ36LSmOvu";
  }
  stripe = require("stripe")(
    "sk_test_51IWoNlAXegvVyt5s8RgdmlA7kMtgxRkk5ckcNHQYVjgTyMCxKHDlgJm810tTm3KIVXe34FvDSlnsqzigH25AwsLU00nIkry9yo"
  );
}

app.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, ENDPOINT_SECRET);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    const createSubscription = async (
      trainerID,
      userID,
      subscriptionID,
      expireDate
    ) => {
      const i = v5(trainerID + userID, UUID);
      const time = new Date();
      const expire = new Date(expireDate).toISOString();
      const exp = expire.slice(0, 10);
      const params = {
        TableName: process.env.SUB_TABLE_NAME,
        Item: {
          id: i,
          __typename: "UserSubscriptionTrainer",
          createdAt: time.toISOString(),
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
      const i = v5(trainerID + userID, process.env.UUID);
      console.log(i);
      const params = {
        TableName: process.env.SUB_TABLE_NAME,
        Key: { id: i },
      };

      return await docClient.delete(params).promise();
    };

    const getTrainer = async (priceID) => {
      return await stripe.prices.retrieve(priceID);
    };

    const query = async (stripeID) => {
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

    // Handle the event
    switch (event.type) {
      case "invoice.paid":
        const paymentIntent = event.data.object;
        console.log("Invoice Paid.");
        console.log(paymentIntent);
        query(paymentIntent.customer).then((user) => {
          query(paymentIntent.transfer_data.destination).then((trainer) => {
            stripe.subscriptions
              .retrieve(paymentIntent.subscription)
              .then((subscription) => {
                createSubscription(
                  trainer.Items[0].id,
                  user.Items[0].id,
                  subscription.id,
                  subscription.current_period_end
                ).then(() => response.json({ received: true }));
              });
          });
        });
        break;

      case "customer.subscription.deleted":
        const subscription = event.data.object;
        console.log("Customer Subscription Delete.");
        console.log(subscription);
        query(subscription.customer).then((user) => {
          getTrainer(subscription.plan.id).then((trainerStripeID) => {
            query(trainerStripeID.lookup_key).then((trainer) => {
              deleteSubscription(
                trainer.Items[0].id,
                user.Items[0].id
              ).then(() => response.json({ received: true }));
            });
          });
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        // Return a response to acknowledge receipt of the event
        response.json({ received: true });
    }
  }
);

app.post("/*", function (req, res) {
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
