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

require("dotenv").config();

// declare a new express app
const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const stripe = require("stripe")(process.env.SECRET_TEST_KEY);

app.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.ENDPOINT_SECRET
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    const createSubscription = async (trainerID, userID) => {
      const i = v5(trainerID + userID, process.env.UUID);
      const time = new Date();
      const params = {
        TableName: process.env.SUB_TABLE_NAME,
        Item: {
          id: i,
          __typename: "UserSubscriptionTrainer",
          createdAt: time.toISOString(),
          userSubscriptionTrainerTrainerId: trainerID,
          userSubscriptionTrainerUserId: userID,
          updatedAt: time.toISOString(),
        },
      };

      return await docClient.put(params).promise();
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
        console.log(paymentIntent);
        query(paymentIntent.customer).then((user) => {
          query(paymentIntent.transfer_data.destination).then((trainer) => {
            console.log("IDs");
            console.log(trainer.Items[0].id);
            console.log(user.Items[0].id);
            createSubscription(trainer.Items[0].id, user.Items[0].id).then(() =>
              response.json({ received: true })
            );
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
