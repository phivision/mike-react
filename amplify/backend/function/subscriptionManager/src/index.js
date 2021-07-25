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
      console.log(i);
      if (i.CancelAtPeriodEnd === false) {
        if (i.User.TokenBalance - i.Trainer.SubscriptionPrice >= 0) {
          let expireDate;
          if (
            parseInt(i.ExpireDate.slice(8, 10)) ===
            parseInt(i.createdAt.slice(8, 10))
          ) {
            expireDate = new Date(
              parseInt(i.ExpireDate.slice(0, 4)),
              parseInt(i.ExpireDate.slice(5, 7)) - 1,
              parseInt(i.ExpireDate.slice(8, 10))
            );

            expireDate.setMonth(expireDate.getMonth() + 1);

            if (
              expireDate.getMonth() -
                ((parseInt(i.ExpireDate.slice(5, 7)) - 1) % 11) !==
              1
            ) {
              expireDate.setDate(0);
            }
          } else {
            expireDate = new Date(
              parseInt(i.ExpireDate.slice(0, 4)),
              parseInt(i.ExpireDate.slice(5, 7)),
              parseInt(i.createdAt.slice(8, 10))
            );
          }

          let dateString = expireDate.toISOString();
          dateString = dateString.slice(0, 10);

          console.log(dateString);
          await Promise.all([
            updateSubscription(i.id, dateString),
            deductTokens(
              i.User.id,
              i.User.TokenBalance,
              i.Trainer.SubscriptionPrice
            ),
          ]);
        }
      }
    })
  );
};
