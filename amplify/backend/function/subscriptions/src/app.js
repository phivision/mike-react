/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["SEED_UUID"].map(secretName => process.env[secretName]),
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

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const asyncHandler = require("express-async-handler");

const {
  expireSubscription,
  createSubscription,
  deductTokens,
  getProfileByID,
} = require("./requests.js");

var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.post(
  "/sub/",
  asyncHandler(async (req, res, next) => {
    const [user, trainer] = await Promise.all([
      getProfileByID(req.body.userID),
      getProfileByID(req.body.trainerID),
    ]);

    if (user.TokenBalance - trainer.SubscriptionPrice >= 0) {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);

      const curr = new Date();
      if (date.getMonth() - (curr.getMonth() % 11) !== 1) {
        date.setDate(0);
      }

      let dateString = date.toISOString();
      dateString = dateString.slice(0, 10);
      await Promise.all([
        createSubscription(req.body.trainerID, req.body.userID, dateString),
        deductTokens(
          req.body.userID,
          user.TokenBalance,
          trainer.SubscriptionPrice
        ),
      ]);

      res.status(200).send();
    }
    res.status(500).send();
  })
);

app.delete("/sub"),
  asyncHandler(async (req, res, next) => {
    await expireSubscription(req.body.id);

    res.status(200).send();
  });

app.use((req, res, next) => {
  console.log("Route not found.");
  res.status(404).send();
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
