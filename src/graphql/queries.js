/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        LastName
        FirstName
        UserRole
        Weight
        Description
        createdAt
        updatedAt
        owner
        Contents {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      UserImage
      LastName
      FirstName
      UserRole
      Weight
      Description
      createdAt
      updatedAt
      owner
      Contents {
        items {
          id
          ContentName
          Description
          Length
          IsDemo
          ViewCount
          Thumbnail
          Preview
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const getUserContent = /* GraphQL */ `
  query GetUserContent($id: ID!) {
    getUserContent(id: $id) {
      id
      ContentName
      Description
      Length
      IsDemo
      ViewCount
      Thumbnail
      Preview
      createdAt
      updatedAt
      Creator {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        LastName
        FirstName
        UserRole
        Weight
        Description
        createdAt
        updatedAt
        owner
        Contents {
          nextToken
        }
      }
      owner
    }
  }
`;
export const listUserContents = /* GraphQL */ `
  query ListUserContents(
    $filter: ModelUserContentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserContents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ContentName
        Description
        Length
        IsDemo
        ViewCount
        Thumbnail
        Preview
        createdAt
        updatedAt
        Creator {
          id
          Birthday
          Email
          Gender
          Height
          Price
          RegDate
          StripeID
          UserImage
          LastName
          FirstName
          UserRole
          Weight
          Description
          createdAt
          updatedAt
          owner
        }
        owner
      }
      nextToken
    }
  }
`;
