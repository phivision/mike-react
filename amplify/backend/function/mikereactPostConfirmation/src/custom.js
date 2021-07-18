const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

const graphql = require("graphql");
const gql = require("graphql-tag");
const { print } = graphql;

const createUserProfile = gql`
  mutation CreateUserProfile($input: CreateUserProfileInput!) {
    createUserProfile(input: $input) {
      id
      Email
      RegDate
      LastName
      FirstName
      UserRole
      owner
    }
  }
`;

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

const addUser = async (userAttributes) => {
  const cognitoID = userAttributes.sub;
  const email = userAttributes.email;
  const role = userAttributes["custom:role"];
  const first = userAttributes["custom:first_name"];
  const last = userAttributes["custom:last_name"];
  const dateTime = new Date().toISOString();
  const today = dateTime.slice(0, 10);

  const variables = {
    input: {
      id: cognitoID,
      Email: email,
      UserRole: role,
      FirstName: first,
      LastName: last,
      RegDate: today,
      owner: cognitoID,
    },
  };

  const res = await request(createUserProfile, variables);

  return res;
};

exports.handler = (event, context, callback) => {
  if (event.request.userAttributes.sub) {
    addUser(event.request.userAttributes).then(() => callback(null, event));
  }
};
