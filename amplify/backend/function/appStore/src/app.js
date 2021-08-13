/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["APPLE_SHARED_SECRET"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const appleReceiptVerify = require("node-apple-receipt-verify");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const asyncHandler = require("express-async-handler");

const { getProfileByID, addTokens, createSubscription } = require("./requests");

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(
  asyncHandler(async (req, res, next) => {
    const { Parameters } = await new AWS.SSM()
      .getParameters({
        Names: ["APPLE_SHARED_SECRET"].map(
          (secretName) => process.env[secretName]
        ),
        WithDecryption: true,
      })
      .promise();

    const secretKey = Parameters.find(
      (e) => e.Name === process.env.APPLE_SHARED_SECRET
    );

    appleReceiptVerify.config({
      secret: secretKey.Value,
      extended: true,
      excludeOldTransactions: true,
      environment: ["production", "sandbox"],
    });

    next();
  })
);

app.post(
  "/appstore/verify",
  asyncHandler(async (req, res, next) => {
    const { body } = req;
    const { trainerID, userID, receipt } = body;
    const products = await appleReceiptVerify.validate({
      receipt: receipt,
    });
    if (Array.isArray(products)) {
      const { productId } = products[0];
      if (productId.slice(0, 5) === "Coins") {
        const user = await getProfileByID(userID);

        await addTokens(userID, user.TokenBalance, productId.slice(-4) * 1);
        res.status(200).send();
      } else if (productId.slice(0, 3) === "Sub") {
        const trainer = await getProfileByID(trainerID);

        if (trainer.SubscriptionPrice === productId.slice(-4)) {
          const { originalPurchaseDate } = products[0];
          const purchase = new Date(Math.round(originalPurchaseDate));
          const expire = new Date(purchase.setMonth(purchase.getMonth() + 1));
          const expireDate =
            expire.getFullYear() +
            "-" +
            (expire.getMonth() < 10 ? "0" : "") +
            expire.getMonth() +
            "-" +
            (expire.getDay() < 10 ? "0" : "") +
            expire.getDay(); //expire.toLocaleString().slice(0, 9);

          const result = await createSubscription(
            trainerID,
            userID,
            expireDate
          );
          res.status(200).send();
        } else {
          res.status(500).send();
        }
      } else {
        res.status(500).send();
      }
    } else {
      res.status(500).send();
    }
  })
);

app.post(
  "/appstore/webhook",
  asyncHandler(async (req, res, next) => {})
);

app.use(function (req, res, next) {
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
