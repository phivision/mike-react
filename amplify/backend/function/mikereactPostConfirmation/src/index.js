/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /*
  this file will loop through all js modules which are uploaded to the lambda resource,
  provided that the file names (without extension) are included in the "MODULES" env variable.
  "MODULES" is a comma-delimmited string.
*/
const moduleNames = process.env.MODULES.split(",");
const modules = moduleNames.map((name) => require(`./${name}`));

exports.handler = (event, context, callback) => {
  for (let i = 0; i < modules.length; i += 1) {
    const { handler } = modules[i];
    handler(event, context, callback);
  }
};
