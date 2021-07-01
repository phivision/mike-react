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

const prices = require("./prices").prices;
const conversionRate = require("./prices").conversionRate;

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

const getProfileByID = async (id) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { id: id },
  };

  return await docClient.get(params).promise();
};

app.post("/stripe/api/trainer/create", function (req, res) {
  const create = async (id) => {
    let account = await stripe.accounts.create({
      email: req.body.email,
      type: "express",
    });
    const query = await getProfileByID(id);
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
  const onboard = async (StripeID) => {
    return await stripe.accountLinks.create({
      account: StripeID,
      refresh_url: req.body.refreshUrl,
      return_url: req.body.returnUrl,
      type: "account_onboarding",
    });
  };

  getProfileByID(req.body.id).then((p) => {
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
  const getLink = async (StripeID) => {
    return await stripe.accounts.createLoginLink(StripeID);
  };

  getProfileByID(req.body.id).then((p) => {
    getLink(p.Item.StripeID)
      .then((l) => res.json({ AccountLink: l.url }))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/trainer/get/price", function (req, res) {
  const getPrices = async (StripeID) =>
    await stripe.prices.list({ active: true, lookup_keys: [StripeID] });

  getProfileByID(req.body.id).then((p) => {
    getPrices(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/trainer/get/balance", function (req, res) {
  const getPrices = async (StripeID) =>
    await stripe.balance.retrieve({}, { stripeAccount: StripeID });

  getProfileByID(req.body.id).then((p) => {
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
    const query = await getProfileByID(req.body.id);
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

app.post("/stripe/api/trainer/get/account", function (req, res) {
  const getAccount = async (StripeID) =>
    await stripe.accounts.retrieve(StripeID);

  getProfileByID(req.body.id).then((p) => {
    getAccount(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/trainer/cashout", function (req, res) {
  const resetTokens = async (userID) => {
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
        ":d": 0,
      },
      ReturnValues: "ALL_NEW",
    };

    return await docClient.update(params).promise();
  };

  const transferBalance = async (balance, stripeID) => {
    return await stripe.transfers.create({
      amount: balance * conversionRate,
      currency: "usd",
      destination: stripeID,
    });
  };

  getProfileByID(req.body.id).then((p) => {
    transferBalance(p.Item.TokenBalance, p.Item.StripeID)
      .then(() => {
        resetTokens(req.body.id)
          .then(() => res.status(200).send())
          .catch((e) => {
            console.log(e);
            res.status(500).send();
          });
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

app.post("/stripe/api/user/create/subscription", function (req, res) {
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
    const price = await stripe.prices.list({
      active: true,
      lookup_keys: [StripeID],
    });
    return price.data[0];
  };

  const createSubscription = async (customerID, priceID, trainerID) => {
    const req = {
      customer: customerID,
      items: [{ price: priceID }],
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: 20,
      transfer_data: {
        destination: trainerID,
      },
    };

    console.log(req);
    // Create the subscription
    return await stripe.subscriptions.create(req);
  };

  const update = async () => {
    const customer = await getProfileByID(req.body.customerID).Item;
    const trainer = await getProfileByID(req.body.trainerID).Item;
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

app.post("/stripe/api/user/update/name", function (req, res) {
  getProfileByID(req.body.id).then((p) => {
    stripe.customers
      .update(p.Item.StripeID, { name: req.body.name })
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/delete/subscription", function (req, res) {
  const updatePeriodEnd = async (id) => {
    const params = {
      TableName: process.env.SUB_TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set #s = :d",
      ExpressionAttributeNames: {
        "#s": "CancelAtPeriodEnd",
      },
      ExpressionAttributeValues: {
        ":d": true,
      },
      ReturnValues: "ALL_NEW",
    };

    return await docClient.update(params).promise();
  };

  const unsubscribe = async (stripeSubscriptionID) => {
    await stripe.subscriptions.update(stripeSubscriptionID, {
      cancel_at_period_end: true,
    });
  };

  unsubscribe(req.body.stripeID)
    .then(() =>
      updatePeriodEnd(req.body.subscriptionID)
        .then((p) => {
          console.log(p);
          res.json(p);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).send();
        })
    )
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

app.post("/stripe/api/user/get/payment", function (req, res) {
  const getPaymentMethods = async (StripeID) =>
    await stripe.paymentMethods.list({ customer: StripeID, type: "card" });

  getProfileByID(req.body.id).then((p) => {
    getPaymentMethods(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/get/customer", function (req, res) {
  const getCustomer = async (StripeID) =>
    await stripe.customers.retrieve(StripeID);

  getProfileByID(req.body.id).then((p) => {
    getCustomer(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/get/paymentmethod", function (req, res) {
  const getPaymentMethod = async (id) =>
    await stripe.paymentMethod.retrieve(id);

  getPaymentMethod(req.body.paymentMethodID)
    .then((p) => res.json(p))
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
});

app.post("/stripe/api/user/buy/coins", function (req, res) {
  const getPrice = () => {
    if (req.body.coinCount.toString() in prices) {
      return prices[req.body.coinCount.toString()];
    } else {
      res.status(500).send();
    }
  };

  const createPaymentIntent = async (a, stripeID) => {
    return await stripe.paymentIntents.create({
      amount: a,
      customer: stripeID,
      currency: "usd",
    });
  };

  const amount = getPrice();
  getProfileByID(req.body.id).then((p) => {
    createPaymentIntent(amount, p.Item.StripeID)
      .then((p) => res.json(p.client_secret))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/get/subscriptions", function (req, res) {
  const getSubscriptions = async (StripeID) =>
    await stripe.subscriptions.list({ customer: StripeID });

  getProfileByID(req.body.id).then((p) => {
    getSubscriptions(p.Item.StripeID)
      .then((p) => res.json(p))
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });
});

app.post("/stripe/api/user/create/payment", function (req, res) {
  const setPayment = async (customerID) => {
    return await stripe.paymentMethods.attach(req.body.paymentMethodID, {
      customer: customerID,
    });
  };

  getProfileByID(req.body.id).then((p) => {
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
  const setInvoice = async (customerID) => {
    return await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });
  };

  getProfileByID(req.body.id).then((p) => {
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
