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
  getFavRelationshipListByID,
  delFavRalationship,
  delContentByContentId,
} = require("./requests.js");
// declare a new express app
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
  "/videoCleanUpFavorite/delContentAndRelFav",
  asyncHandler(async (req, res, next) => {
    const contentId = req.query.contentId;
    const favDic = await getFavRelationshipListByID(contentId);
    console.log("favDic:", JSON.stringify(favDic));
    const favList = favDic.FavoriteUser.items;
    for (var i = 0; i < favList.length; i++) {
      const favItem = favList[i];
      console.log("favId", favItem.id);
      await delFavRalationship(favItem.id);
    }
    const responese = await delContentByContentId(contentId);
    if (typeof responese.error == "undefined") {
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  })
);

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
