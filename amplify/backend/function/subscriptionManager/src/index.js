/* Amplify Params - DO NOT EDIT
	API_MIKEAMPLIFY_GRAPHQLAPIENDPOINTOUTPUT
	API_MIKEAMPLIFY_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const {
  getSubscriptionsByExpireDate,
  updateSubscription,
  deductTokens,
} = require("./requests.js");

exports.handler = async () => {
  const date = new Date();
  const dateString = new Date(date.setDate(date.getDate() - 1)).toISOString();
  const dateAWS = dateString.slice(0, 10);

  const subs = await getSubscriptionsByExpireDate(dateAWS);

  await Promise.all(
    subs.map(async (i) => {
      if (i.User.TokenBalance - i.Trainer.SubscriptionPrice >= 0) {
        let expireDate;
        if (
          parseInt(i.ExpireDate.slice(8, 10)) ===
          parseInt(i.createdAt.slice(8, 10))
        ) {
          const date = new Date(
            parseInt(i.ExpireDate.slice(0, 4)),
            parseInt(i.ExpireDate.slice(5, 7)) - 1,
            parseInt(i.ExpireDate.slice(8, 10))
          );
          expireDate = new Date(date.setMonth(date.getMonth() + 1));
          if (expireDate.getMonth() - (date.getMonth() % 12) !== 1) {
            expireDate = new Date(expireDate.getYear(), expireDate.getYear());
            expireDate.setDate(expireDate.getDate() - 1);
          }
          expireDate = expireDate.toISOString();
          expireDate = expireDate.slice(0, 10);
        } else {
          expireDate = new Date(
            i.ExpireDate.slice(0, 4),
            parseInt(i.ExpireDate.slice(5, 7)) + 1,
            parseInt(i.createdAt.slice(8, 10))
          );

          //Yikes, changing types
          expireDate = expireDate.toISOString();
          expireDate = expireDate.slice(0, 10);
        }
        await Promise.all([
          updateSubscription(i.id, expireDate),
          deductTokens(
            i.User.id,
            i.User.TokenBalance,
            i.Trainer.SubscriptionPrice
          ),
        ]);
      }
    })
  );
};
