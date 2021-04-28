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

const stripe = require("stripe")(process.env.SECRET_TEST_KEY);

app.post("/stripe/api/trainer/create", function (req, res) {
  const queryName = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const create = async (id) => {
    let account = await stripe.accounts.create({
      email: req.body.email,
      type: "express",
    });
    const query = await queryName(id);
    const product = await stripe.products.create(
      { name: query.FirstName + " " + query.LastName },
      { stripeAccount: account.id }
    );

    await stripe.prices.create(
      {
        unit_amount: 0,
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id,
      },
      { stripeAccount: account.id }
    );
    return account.id;
  };

  const setStripeID = async (id, stripeID) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set #s = :d",
      ExpressionAttributeNames: {
        "#s": "StripeID",
      },
      ExpressionAttributeValues: {
        ":d": stripeID,
      },
      ReturnValues: "UPDATED_NEW",
    };

    return await docClient.update(params).promise();
  };

  create(req.body.id)
    .then((StripeID) => {
      setStripeID(req.body.id, StripeID).then(() => res.status(200).send());
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

app.post("/stripe/api/user/create", function (req, res) {
  const create = async () => {
    let account = await stripe.customers.create({
      email: req.body.email,
    });
    return account.id;
  };

  const setStripeID = async (id, stripeID) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set #s = :d",
      ExpressionAttributeNames: {
        "#s": "StripeID",
      },
      ExpressionAttributeValues: {
        ":d": stripeID,
      },
      ReturnValues: "UPDATED_NEW",
    };

    return await docClient.update(params).promise();
  };

  create()
    .then((StripeID) => {
      setStripeID(req.body.id, StripeID).then(() => {
        res.status(200).send();
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

//refresh + return url have to be https
app.post("/stripe/api/trainer/link/onboarding", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const onboard = async (StripeID) => {
    const accountLinks = await stripe.accountLinks.create({
      account: StripeID,
      refresh_url: req.body.refreshUrl,
      return_url: req.body.returnUrl,
      type: "account_onboarding",
    });
    return accountLinks;
  };

  queryStripeID(req.body.id).then((p) => {
    onboard(p.Item.StripeID)
      .then((link) => res.json({ AccountLink: link.url }))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

//refresh + return url have to be https
app.post("/stripe/api/trainer/link/login", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const getLink = async (StripeID) => {
    const accountLinks = await stripe.accounts.createLoginLink(StripeID);
    return accountLinks;
  };

  queryStripeID(req.body.id).then((p) => {
    getLink(p.Item.StripeID)
      .then((l) => res.json({ AccountLink: l.url }))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/trainer/get/prices", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const getPrices = async (StripeID) => {
    return await stripe.prices.list({ StripeID });
  };

  queryStripeID(req.body.id).then((p) => {
    getPrices(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/checkout", function (req, res) {
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
        success_url: req.body.success_url,
        cancel_url: req.body.cancel_url,
      },
      {
        stripeAccount: req.body.ConnectedID,
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

  queryPrice(req.body.ConnectedID).then((p) => {
    checkout(p)
      .then((session) => res.json({ CheckoutSession: session }))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/*", function (req, res) {
  console.log("Hello");
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
