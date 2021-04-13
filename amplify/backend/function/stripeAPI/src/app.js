/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MIKE_REACT9AA15861_BUCKETNAME
Amplify Params - DO NOT EDIT */
var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
require("dotenv").config();

// declare a new express app
var app = express();

// Use JSON parser for all non-webhook routes
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const stripe = require("Stripe")(process.env.SECRET_TEST_KEY);

app.post("/stripe/create/trainer", function (req, res) {
  const create = async () => {
    let account = await stripe.accounts.create({
      email: req.apiGateway.event.email,
      type: "express",
    });
    res.json({ ConnectedID: account.id });
    return account.id;
  };

  const queryID = async (address) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "Email = :address",
      ExpressionAttributeValues: {
        ":address": { S: address },
      },
    };

    return await docClient.query(params).promise();
  };

  const setStripeID = async (id, stripeID) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set info.StripeID = :d",
      ExpressionAttributeValues: {
        ":d": stripeID,
      },
      ReturnValues: "UPDATED_NEW",
    };

    return await docClient.query(params).promise();
  };

  queryID(req.apiGateway.event.email).then((query) => {
    if (query !== undefined) {
      create()
        .then((StripeID) => {
          setStripeID(query.id, StripeID).then(() =>
            res.json({ ConnectedID: StripeID })
          );
        })
        .catch((e) => {
          console.log(e);
          res.status(500).send();
        });
    } else {
      res.status(500).send();
    }
  });
});

app.post("/stripe/create/user", function (req, res) {
  const create = async () => {
    let account = await stripe.customers.create({
      email: req.apiGateway.event.email,
    });
    res.json({ CustomerID: account.id });
    return account.id;
  };

  const queryID = async (address) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "Email = :address",
      ExpressionAttributeValues: {
        ":address": { S: address },
      },
    };

    return await docClient.query(params).promise();
  };

  const setStripeID = async (id, stripeID) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set info.StripeID = :d",
      ExpressionAttributeValues: {
        ":d": stripeID,
      },
      ReturnValues: "UPDATED_NEW",
    };

    return await docClient.query(params).promise();
  };

  queryID(req.apiGateway.event.email).then((query) => {
    create()
      .then((StripeID) => {
        setStripeID(query.id, StripeID).then(() => {
          res.json({ CustomerID: StripeID });
        });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

//refresh + return url have to be https
app.post("/stripe/onboarding", function (req, res) {
  const onboard = async () => {
    const accountLinks = await stripe.accountLinks.create({
      account: req.apiGateway.event.ConnectedID,
      refresh_url: req.apiGateway.event.refresh_url,
      return_url: req.apiGateway.event.return_url,
      type: "account_onboarding",
    });
    return accountLinks;
  };

  onboard()
    .then((link) => res.json({ AccountLink: link.url }))
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

app.post("/stripe/checkout", function (req, res) {
  const checkout = async (p) => {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        lineItems: [
          {
            price: p,
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: {
          application_fee_percent: 10,
        },
        success_url: req.apiGateway.event.success_url,
        cancel_url: req.apiGateway.event.cancel_url,
      },
      {
        stripeAccount: req.apiGateway.event.ConnectedID,
      }
    );
    return session;
  };

  const queryPrice = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "StripeID = :id",
      ExpressionAttributeValues: {
        ":id": { S: id },
      },
    };

    return await docClient.query(params).promise();
  };

  queryPrice(req.apiGateway.event.ConnectedID).then((p) => {
    checkout(p)
      .then((session) => res.json({ CheckoutSession: session }))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

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
