/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const asyncHandler = require("express-async-handler");
const { prices, conversionRate } = require("./prices");

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

app.post(
  "/stripe/api/trainer/create",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const [account, product] = await Promise.all([
      stripe.accounts.create({
        email: req.body.email,
        type: "express",
      }),
      stripe.products.create({
        name: user.Item.FirstName + " " + user.Item.LastName,
      }),
    ]);

    await Promise.all([
      stripe.prices.create({
        unit_amount: 0,
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id,
        lookup_key: account.id,
      }),
      setStripeID(req.body.id, account.id),
    ]);

    res.status(200).send();
  })
);

//refresh + return url have to be https
app.post(
  "/stripe/api/trainer/link/onboarding",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const onboardingLink = await stripe.accountLinks.create({
      account: user.Item.StripeID,
      refresh_url: req.body.refreshUrl,
      return_url: req.body.returnUrl,
      type: "account_onboarding",
    });

    res.json({ AccountLink: onboardingLink.url });
  })
);

//refresh + return url have to be https
app.post(
  "/stripe/api/trainer/link/login",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const loginLink = await stripe.accounts.createLoginLink(user.Item.StripeID);

    res.json({ AccountLink: loginLink.url });
  })
);

app.post(
  "/stripe/api/trainer/get/price",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const prices = await stripe.prices.list({
      active: true,
      lookup_keys: [user.Item.StripeID],
    });

    res.json(prices);
  })
);

app.post(
  "/stripe/api/trainer/get/balance",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const balance = await stripe.balance.retrieve(
      {},
      { stripeAccount: user.Item.StripeID }
    );

    res.json(balance);
  })
);

app.post(
  "/stripe/api/trainer/update/price",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const prices = await stripe.prices.list({
      active: true,
      lookup_keys: [user.Item.StripeID],
    });

    await Promise.all([
      stripe.prices.update(prices.data[0].id, {
        active: false,
        lookup_key: "",
      }),
      stripe.prices.create({
        unit_amount: req.body.newPrice,
        currency: "usd",
        recurring: { interval: "month" },
        product: prices.data[0].product,
        lookup_key: user.Item.StripeID,
      }),
    ]);

    res.status(200).send();
  })
);

app.post(
  "/stripe/api/trainer/get/account",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const account = await stripe.accounts.retrieve(user.Item.StripeID);

    res.json(account);
  })
);

app.post(
  "/stripe/api/trainer/cashout",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    await stripe.transfers.create({
      amount: user.Item.TokenBalance * conversionRate,
      currency: "usd",
      destination: user.Item.StripeID,
    });

    await resetTokens(req.body.id);

    res.status(200).send();
  })
);

app.post(
  "/stripe/api/user/create",
  asyncHandler(async (req, res, next) => {
    const account = await stripe.customers.create({ email: req.body.email });

    await setStripeID(req.body.id, account.id);

    res.status(200).send();
  })
);

app.post(
  "/stripe/api/user/create/subscription",
  asyncHandler(async (req, res, next) => {
    const [customer, trainer] = await Promise.all([
      getProfileByID(req.body.customerID),
      getProfileByID(req.body.trainerID),
    ]);

    const prices = await stripe.prices.list({
      active: true,
      lookup_keys: [trainer.Item.StripeID],
    });

    await stripe.paymentMethods.attach(req.body.paymentMethodID, {
      customer: customer.Item.StripeID,
    });

    await stripe.customers.update(customer.Item.StripeID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });

    await stripe.subscriptions.create({
      customer: customer.Item.StripeID,
      items: [{ price: prices.data[0].id }],
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: 20,
      transfer_data: {
        destination: trainer.Item.StripeID,
      },
    });

    res.status(200).send();
  })
);

app.post(
  "/stripe/api/user/update/name",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const customer = await stripe.customers.update(user.Item.StripeID, {
      name: req.body.name,
    });

    res.json(customer);
  })
);

app.post(
  "/stripe/api/user/delete/subscription",
  asyncHandler(async (req, res, next) => {
    const [r1, r2] = await Promise.all([
      stripe.subscriptions.update(req.body.stripeID, {
        cancel_at_period_end: true,
      }),
      updatePeriodEnd(req.body.subscriptionID),
    ]);

    res.json(r2);
  })
);

app.post(
  "/stripe/api/user/get/payment",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.Item.StripeID,
      type: "card",
    });

    res.json(paymentMethods);
  })
);

app.post(
  "/stripe/api/user/get/customer",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const customer = await stripe.customers.retrieve(user.Item.StripeID);

    res.json(customer);
  })
);

app.post(
  "/stripe/api/user/get/paymentmethod",
  asyncHandler(async (req, res, next) => {
    const paymentMethod = await stripe.paymentMethod.retrieve(
      req.body.paymentMethodID
    );

    res.json(paymentMethod);
  })
);

app.post(
  "/stripe/api/user/buy/coins",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    if (!req.body.coinCount.toString() in prices) {
      throw new Error("Coin pricing bundle not found");
    }

    const price = prices[req.body.coinCount.toString()];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      customer: user.Item.StripeID,
      currency: "usd",
    });

    res.json(paymentIntent.client_secret);
  })
);

app.post(
  "/stripe/api/user/get/subscriptions",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: user.Item.StripeID,
    });

    res.json(subscriptions);
  })
);

app.post(
  "/stripe/api/user/create/payment",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const paymentMethod = await stripe.paymentMethods.attach(
      req.body.paymentMethodID,
      {
        customer: user.Item.StripeID,
      }
    );

    res.json(paymentMethod);
  })
);

app.post(
  "/stripe/api/user/delete/payment",
  asyncHandler(async (req, res, next) => {
    const detachPayment = await stripe.paymentMethods.detach(
      req.body.paymentMethodID
    );

    res.json(detachPayment);
  })
);

app.post(
  "/stripe/api/user/update/defaultpayment",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const invoiceReturn = await stripe.customers.update(user.Item.StripeID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });

    res.json(invoiceReturn);
  })
);

app.use(function (req, res, next) {
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started.");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
