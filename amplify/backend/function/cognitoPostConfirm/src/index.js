/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// Load the AWS SDK for Node.js
let AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: process.env.REGION });

// Create the DynamoDB service object
let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const tableName = process.env.TABLE_NAME;

function addUser(userAttributes) {
  const cognitoID = userAttributes.sub;
  const email = userAttributes.email;
  const role = userAttributes["custom:role"];
  const first = userAttributes["custom:first_name"];
  const last = userAttributes["custom:last_name"];
  const dateTime = new Date().toISOString();
  const today = dateTime.slice(0, 10);
  var params = {
    TableName: tableName,
    Item: {
      id: { S: cognitoID },
      RegDate: { S: today },
      Email: { S: email },
      UserRole: { S: role },
      FirstName: { S: first },
      LastName: { S: last },
      owner: { S: cognitoID },
      createdAt: { S: dateTime },
      updatedAt: { S: dateTime },
    },
  };

  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}

exports.handler = (event, context, callback) => {
  console.log(event);
  if (event.request.userAttributes.sub) {
    addUser(event.request.userAttributes);
  }
  // Return to Amazon Cognito
  callback(null, event);
};
