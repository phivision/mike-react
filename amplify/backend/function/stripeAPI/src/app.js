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

let stripe;

if (process.env.ENV === "prod") {
  stripe = require("stripe")(
    "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"
  );
} else {
  stripe = require("stripe")(
    "sk_test_51IWoNlAXegvVyt5s8RgdmlA7kMtgxRkk5ckcNHQYVjgTyMCxKHDlgJm810tTm3KIVXe34FvDSlnsqzigH25AwsLU00nIkry9yo"
  );
}

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
    const product = await stripe.products.create({
      name: query.Item.FirstName + " " + query.Item.LastName,
    });

    await stripe.prices.create({
      unit_amount: 0,
      currency: "usd",
      recurring: { interval: "month" },
      product: product.id,
      lookup_key: account.id,
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
    return await stripe.accountLinks.create({
      account: StripeID,
      refresh_url: req.body.refreshUrl,
      return_url: req.body.returnUrl,
      type: "account_onboarding",
    });
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
    return await stripe.accounts.createLoginLink(StripeID);
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

  const getPrices = async (StripeID) =>
    await stripe.prices.list({ active: true, lookup_keys: [StripeID] });

  queryStripeID(req.body.id).then((p) => {
    getPrices(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/trainer/get/balance", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const getPrices = async (StripeID) =>
    await stripe.balance.retrieve({}, { stripeAccount: StripeID });

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

  const getPrices = async (StripeID) => {
    const prices = await stripe.prices.list({
      active: true,
      lookup_keys: [StripeID],
    });
    return prices.data[0];
  };

  const updatePrice = async (StripeID, priceID, newPrice, productID) => {
    await stripe.prices.update(priceID, { active: false, lookup_key: "" });
    return await stripe.prices.create({
      unit_amount: newPrice,
      currency: "usd",
      recurring: { interval: "month" },
      product: productID,
      lookup_key: StripeID,
    });
  };

  const update = async () => {
    const query = await queryStripeID(req.body.id);
    const price = await getPrices(query.Item.StripeID);
    return await updatePrice(
      query.Item.StripeID,
      price.id,
      req.body.newPrice,
      price.product
    );
  };

  update()
    .then(() => {
      res.status(200).send();
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

app.post("/stripe/api/user/create/subscription", function (req, res) {
  const query = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    const query = await docClient.get(params).promise();
    return query.Item;
  };

  const setPayment = async (customerID) => {
    return await stripe.paymentMethods.attach(req.body.paymentMethodID, {
      customer: customerID,
    });
  };

  const setInvoice = async (customerID) => {
    return await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });
  };

  const getPrices = async (StripeID) => {
    price = await stripe.prices.list({ active: true, lookup_keys: [StripeID] });
    return price.data[0];
  };

  const createSubscription = async (customerID, priceID, trainerID) => {
    // Create the subscription
    return await stripe.subscriptions.create({
      customer: customerID,
      items: [{ price: priceID }],
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: 10,
      transfer_data: {
        destination: trainerID,
      },
    });
  };

  const update = async () => {
    const customer = await query(req.body.customerID);
    const trainer = await query(req.body.trainerID);
    const price = await getPrices(trainer.StripeID);

    await setPayment(customer.StripeID);
    await setInvoice(customer.StripeID);
    return await createSubscription(
      customer.StripeID,
      price.id,
      trainer.StripeID
    );
  };

  update()
    .then(() => res.status(200).send())
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

app.post("/stripe/api/user/delete/subscription", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const unsubscribe = async (subscriptionID) =>
    await stripe.subscriptions.update(subscriptionID, {
      cancel_at_period_end: true,
    });

  queryStripeID(req.body.id).then((p) => {
    unsubscribe(req.body.subscriptionID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/get/payment", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const getPaymentMethods = async (StripeID) =>
    await stripe.paymentMethods.list({ customer: StripeID, type: "card" });

  queryStripeID(req.body.id).then((p) => {
    getPaymentMethods(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/get/subscriptions", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const getSubscriptions = async (StripeID) =>
    await stripe.subscriptions.list({ customer: StripeID });

  queryStripeID(req.body.id).then((p) => {
    getSubscriptions(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/create/payment", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const setPayment = async (customerID) => {
    return await stripe.paymentMethods.attach(req.body.paymentMethodID, {
      customer: customerID,
    });
  };

  queryStripeID(req.body.id).then((p) => {
    setPayment(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/delete/payment", function (req, res) {
  const detachPayment = async () => {
    return await stripe.paymentMethods.detach(req.body.paymentMethodID);
  };

  detachPayment()
    .then((p) => res.json(p))
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

app.post("/stripe/api/user/update/defaultpayment", function (req, res) {
  const queryStripeID = async (id) => {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { id: id },
    };

    return await docClient.get(params).promise();
  };

  const setInvoice = async (customerID) => {
    return await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });
  };

  queryStripeID(req.body.id).then((p) => {
    setInvoice(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/*", function (req, res) {
  console.log("Route not found.");
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started.");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
