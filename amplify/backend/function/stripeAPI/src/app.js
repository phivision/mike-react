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

app.post("/stripe/api/trainer/get/price", function (req, res) {
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

//TODO: modularize to be able to pick a specific price/handle multiple prices/products? in the future
app.post("/stripe/api/trainer/update/price", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const getPrices = async (StripeID) =>
    await stripe.prices.list({ active: true }, { stripeAccount: StripeID });

  const updatePrice = async (StripeID, priceID, newPrice, productID) => {
    stripe.prices
      .update(priceID, { active: false }, { stripeAccount: StripeID })
      .then(() => {
        stripe.prices.create(
          {
            unit_amount: newPrice,
            currency: "usd",
            recurring: { interval: "month" },
            product: productID,
          },
          { stripeAccount: StripeID }
        );
      });
  };

  queryStripeID(req.body.id).then((q) => {
    getPrices(q.Item.StripeID)
      .then(async (p) => {
        const response = await updatePrice(
          q.Item.StripeID,
          p.data[0].id,
          req.body.newPrice,
          p.data[0].product
        );
        res.json(response);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
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

app.post("/stripe/api/user/checkout", function (req, res) {
  const query = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const setPayment = async (customerID) => {
    await stripe.paymentMethods.attach(req.body.paymentMethodID, {
      customer: customerID,
    });
  };

  const setInvoice = async (customerID) => {
    await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });
  };

  const getPrices = async (StripeID) => {
    price = await stripe.prices.list({}, { stripeAccount: StripeID });
    return price.data.data[1];
  };

  const createSubscription = async (customerID, priceID) => {
    // Create the subscription
    return await stripe.subscriptions.create({
      customer: customerID,
      items: [{ price: priceID }],
      expand: ["latest_invoice.payment_intent"],
    });
  };

  const update = async () => {
    const customer = await query(req.body.customerID);
    const trainer = await query(req.body.trainerID);
    const priceID = await getPrices(trainer.Item.StripeID);

    setPayment(customer.Item.StripeID).then(() => {
      setInvoice(customer.Item.StripeID).then(() => {
        createSubscription(customer.Item.StripeID, priceID);
      });
    });
  };

  update()
    .then(() => res.status(200).send())
    .catch((e) => {
      console.log(e);
      res.status(500).send();
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
