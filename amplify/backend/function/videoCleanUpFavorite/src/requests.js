const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;

const graphql = require("graphql");
const gql = require("graphql-tag");
const { print } = graphql;

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

const getFavRelationshipListByID = async (contentId) => {
  const getFavRelationshipListByID = gql`
    query MyQuery($id: ID!) {
        getUserContent(id: $id) {
            FavoriteUser {
              items {
                id
              }
            }
        } 
    }
  `;
  const variables = { id: contentId };
  console.log('variables:',variables);
  const res = await request(getFavRelationshipListByID, variables);
  console.log('result:',res);
  return res.data.getUserContent;
};

const delFavRalationship = async (favId) => {
    const delFavorite = gql`
        mutation MyMutation($id: ID!) {
            deleteUserFavoriteContent(input: {id: $id}) {
              id
            }
        }
    `
   const variables = { id: favId };
   console.log('variables:',variables);
   const res = await request(delFavorite, variables);
   console.log('result:',res);
   return res.data.deleteUserFavoriteContent; 
}

const delContentByContentId = async (contentId) =>{
    const delContent = gql `
        mutation MyMutation($id: ID!) {
         deleteUserContent(input: {id: $id}) {
             id
             CreatorID
         }
        }
    `
   const variables = { id: contentId };
   console.log('variables:',variables);
   const res = await request(delContent, variables);
   console.log('result:',res);
   return res.data.deleteUserContent;  
}

module.exports = {
  getFavRelationshipListByID,
  delFavRalationship,
  delContentByContentId
};