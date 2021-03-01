/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($CognitoID: String!) {
    getUserProfile(CognitoID: $CognitoID) {
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      CognitoID
      UserImage
      UserName
      UserRole
      Weight
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: TableUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        CognitoID
        UserImage
        UserName
        UserRole
        Weight
      }
      nextToken
    }
  }
`;
export const queryUserProfilesByUserRoleIndex = /* GraphQL */ `
  query QueryUserProfilesByUserRoleIndex(
    $UserRole: String!
    $after: String
    $first: Int
  ) {
    queryUserProfilesByUserRoleIndex(
      UserRole: $UserRole
      after: $after
      first: $first
    ) {
      items {
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        CognitoID
        UserImage
        UserName
        UserRole
        Weight
      }
      nextToken
    }
  }
`;
