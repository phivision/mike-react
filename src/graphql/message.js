export const getUserTrainers = /* GraphQL */ `
  query GetUserTrainers($id: ID!) {
    getUserProfile(id: $id) {
      id
      FirstName
      Email
      Description
      Gender
      LastName
      TokenBalance
      UserImage
      UserRole
      Subscriptions {
        items {
          Trainer {
            id
            FirstName
            LastName
            UserImage
            UserRole
            Description
            Email
          }
        }
      }
      Users {
        items {
          User {
            id
            Description
            Email
            FirstName
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
      filter: { Status: { eq: UNRESPONDED } }
      sortDirection: ASC
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
          id
          FirstName
          LastName
          UserImage
        }
        ToUser {
          id
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
        Status: UNRESPONDED
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
