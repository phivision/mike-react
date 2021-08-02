const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const appsyncUrl = process.env.API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

const graphql = require("graphql");
const gql = require("graphql-tag");
const { print } = graphql;

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

AWS.config.update({
  region,
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_SESSION_TOKEN
  ),
});

const credentials = AWS.config.credentials;
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
  {
    appsyncUrl,
    region,
    auth: {
      type: "AWS_IAM",
      credentials,
    },
    disableOffline: true,
  },
  {
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
    },
  }
);

const request = (queryDetails, variables) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);
  const endpoint = new urlParse(appsyncUrl).hostname.toString();

  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: print(queryDetails),
    variables: variables,
  });

  const signer = new AWS.Signers.V4(req, "appsync", true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      result.on("data", (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};

const fetchUsers = async (emailValue, userPoolId) => {
  console.log('email = "' + emailValue + '"');
  var params = {
    UserPoolId: userPoolId,
    AttributesToGet: ["sub"],
    Filter: 'email = "' + emailValue + '"',
  };
  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider
      .listUsers(params)
      .promise()
      .then((results) => {
        console.log(JSON.stringify(results));
        let subValue = "";
        let username;
        for (i = 0; i < results.Users.length; i++) {
          username = results.Users[i].Username;
          if (username.search("signinwithapple") != -1) {
            let attributeList = results.Users[i].Attributes;
            if (attributeList.length > 0) {
              subValue = attributeList[0].Value;
            }
          }
        }
        resolve([subValue, username]);
      })
      .catch((e) => {
        console.log(e);
        resolve(e);
      });
  });
};

const createProfile = async (firstName, lastName, email, subId, username) => {
  const createUserProfile = gql`
    mutation createUserProfile($input: CreateUserProfileInput!) {
      createUserProfile(input: $input) {
        FirstName
        LastName
        RegDate
        id
        owner
        UserRole
        Email
      }
    }
  `;
  const nowDate = getNowFormatDate();
  const variables = {
    input: {
      id: subId,
      owner: username,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      RegDate: nowDate,
      UserRole: "student",
    },
  };
  const res = await request(createUserProfile, variables);
  console.log("res", res);
  return res;
};

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

module.exports = {
  fetchUsers,
  createProfile,
};
