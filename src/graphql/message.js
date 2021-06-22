export const getUserTrainers = /* GraphQL */ `
  query GetUserTrainers($id: ID!) {
    getUserProfile(id: $id) {
      Email
      Description
      FirstName
      LastName
      UserImage
      UserRole
      Subscriptions {
        items {
          Trainer {
            Description
            Email
            FirstName
            Gender
            LastName
            UserImage
            UserRole
          }
        }
      }
    }
  }
`;

export const getMessageByToUserID = /* GraphQL */ `
  query GetMessageByToUserID($ToUserID: ID!) {
    messageByToUserID(
      ToUserID: $ToUserID
      filter: { Status: { eq: UNREAD } }
      sortDirection: DESC
    ) {
      items {
        FromUserID
        PostMessages
        Status
        ToUserID
        Type
        createdAt
        id
        FromUser {
          FirstName
          LastName
          UserImage
        }
        ToUser {
          FirstName
          UserImage
          LastName
        }
      }
    }
  }
`;

export const creatNewMessage = /* GraphQL */ `
  mutation CreatNewMessage(
    $FromUserID: ID!
    $PostMessages: String!
    $ToUserID: ID!
  ) {
    createMessage(
      input: {
        FromUserID: $FromUserID
        PostMessages: $PostMessages
        ToUserID: $ToUserID
        Status: UNREAD
        Type: TEXT
      }
    ) {
      FromUserID
      PostMessages
      Status
      ToUserID
      Type
      createdAt
      id
    }
  }
`;
