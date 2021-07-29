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

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const asyncHandler = require("express-async-handler");

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});
const {fetchUsers, createProfile} = require("./requests");

/****************************
* Example post method *
****************************/

app.post('/appleSignIn/configureProfile',asyncHandler(async (req, res, next) => {
    const { body } = req;
    const { email,firstName,lastName } = body;

    const { apiGateway } = req;
    const { event } = apiGateway;
    const { requestContext } = event;
    const { identity } = requestContext;
    const { cognitoAuthenticationProvider } = identity;

    const parts = cognitoAuthenticationProvider.split(':');
    const userPoolIdParts = parts[parts.length - 3].split('/');
    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];

    const subValue = await fetchUsers(email,userPoolId);
    console.log("subValue",subValue);
    if(subValue == ""){
      res.status(500).send();
    }else{
      const createResult = await createProfile(firstName,lastName,email,subValue)
      if(createResult.data.createUserProfile == null){
        res.status(500).send();
      }else{
        res.status(200).send();
      }
    }
  })
);

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
