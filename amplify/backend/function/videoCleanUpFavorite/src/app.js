/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require("aws-sdk");
const asyncHandler = require("express-async-handler");
const {
  getFavRelationshipListByID,
  delFavRalationship,
  delContentByContentId
} = require("./requests.js");
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

app.post('/videoCleanUpFavorite/delContentAndRelFav', 
  asyncHandler(async (req, res, next) => {
    const contentId = req.query.contentId;
    const favDic = await getFavRelationshipListByID(contentId);
    console.log('favDic:',JSON.stringify(favDic));
    const favList = favDic.FavoriteUser.items;
    for(var i=0;i<favList.length;i++){
      const favItem = favList[i];
      console.log("favId",favItem.id);
      await delFavRalationship(favItem.id);
    }
    const responese = await delContentByContentId(contentId)
    if(typeof(responese.error) == 'undefined'){
      res.status(200).send();
    }else{
      res.status(500).send();
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
