/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($UserID: Int!) {
    getUserProfile(UserID: $UserID) {
      UserID
      UserRole
      UserName
      RegDate
      UserImage
      Gender
      Birthday
      Height
      Weight
      Price
      Email
      StripeID
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
        UserID
        UserRole
        UserName
        RegDate
        UserImage
        Gender
        Birthday
        Height
        Weight
        Price
        Email
        StripeID
      }
      nextToken
    }
  }
`;
export const queryUserProfilesByUserRoleIndex = /* GraphQL */ `
  query QueryUserProfilesByUserRoleIndex(
    $UserRole: String!
    $first: Int
    $after: String
  ) {
    queryUserProfilesByUserRoleIndex(
      UserRole: $UserRole
      first: $first
      after: $after
    ) {
      items {
        UserID
        UserRole
        UserName
        RegDate
        UserImage
        Gender
        Birthday
        Height
        Weight
        Price
        Email
        StripeID
      }
      nextToken
    }
  }
`;
