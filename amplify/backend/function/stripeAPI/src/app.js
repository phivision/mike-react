/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["STRIPE_SECRET_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
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
const asyncHandler = require("express-async-handler");
const { prices, conversionRate } = require("./prices");
const { getProfileByID, setStripeID } = require("./requests.js");

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

app.use(
  asyncHandler(async (req, res, next) => {
    const { Parameters } = await new AWS.SSM()
      .getParameters({
        Names: ["STRIPE_SECRET_KEY"].map(
          (secretName) => process.env[secretName]
        ),
        WithDecryption: true,
      })
      .promise();

    const secretKey = Parameters.find(
      (e) => e.Name === process.env.STRIPE_SECRET_KEY
    );

    stripe = require("stripe")(secretKey.Value);

    next();
  })
);

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
        name: user.FirstName + " " + user.LastName,
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
      account: user.StripeID,
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
    const loginLink = await stripe.accounts.createLoginLink(user.StripeID);

    res.json({ AccountLink: loginLink.url });
  })
);

app.post(
  "/stripe/api/trainer/get/price",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const prices = await stripe.prices.list({
      active: true,
      lookup_keys: [user.StripeID],
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
      { stripeAccount: user.StripeID }
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
      lookup_keys: [user.StripeID],
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
        lookup_key: user.StripeID,
      }),
    ]);

    res.status(200).send();
  })
);

app.post(
  "/stripe/api/trainer/get/account",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);
    const account = await stripe.accounts.retrieve(user.StripeID);

    res.json(account);
  })
);

app.post(
  "/stripe/api/trainer/cashout",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    await stripe.transfers.create({
      amount: user.TokenBalance * conversionRate,
      currency: "usd",
      destination: user.StripeID,
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
      lookup_keys: [trainer.StripeID],
    });

    await stripe.paymentMethods.attach(req.body.paymentMethodID, {
      customer: customer.StripeID,
    });

    await stripe.customers.update(customer.StripeID, {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodID,
      },
    });

    await stripe.subscriptions.create({
      customer: customer.StripeID,
      items: [{ price: prices.data[0].id }],
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: 20,
      transfer_data: {
        destination: trainer.StripeID,
      },
    });

    res.status(200).send();
  })
);

app.post(
  "/stripe/api/user/update/name",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const customer = await stripe.customers.update(user.StripeID, {
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
      customer: user.StripeID,
      type: "card",
    });

    res.json(paymentMethods);
  })
);

app.post(
  "/stripe/api/user/get/customer",
  asyncHandler(async (req, res, next) => {
    const user = await getProfileByID(req.body.id);

    const customer = await stripe.customers.retrieve(user.StripeID);

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
      customer: user.StripeID,
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
      customer: user.StripeID,
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
        customer: user.StripeID,
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

    const invoiceReturn = await stripe.customers.update(user.StripeID, {
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
