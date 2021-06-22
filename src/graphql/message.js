export const messagesByToUserID = /* GraphQL */ `
  query messagesByToUserID(
    $ToUserID: String
    $FromUserID: String
    $limit: Int
  ) {
    messagesByToUserID(
      ToUserID: $ToUserID
      limit: $limit
      FromUserID: $FromUserID
    ) {
      items {
        FromUser {
          BgImage
          FirstName
          LastName
          Email
          Users {
            items {
              User {
                BgImage
                FirstName
                LastName
              }
            }
          }
        }
        PostMessages
        Status
        FromUserID
        ToUserID
        Type
        id
        createdAt
      }
    }
  }
`;
