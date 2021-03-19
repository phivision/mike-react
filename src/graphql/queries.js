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
        Subscriptions {
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
          CreatorID
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
      Subscriptions {
        items {
          id
          SubscriberID
          ExpireDate
          ProductID
          TrainerID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const searchUserProfiles = /* GraphQL */ `
  query SearchUserProfiles(
    $filter: SearchableUserProfileFilterInput
    $sort: SearchableUserProfileSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchUserProfiles(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
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
        Subscriptions {
          nextToken
        }
      }
      nextToken
      total
    }
  }
`;
export const getUserContent = /* GraphQL */ `
  query GetUserContent($id: ID!) {
    getUserContent(id: $id) {
      id
      CreatorID
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
        Subscriptions {
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
        CreatorID
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
export const getUserSubscription = /* GraphQL */ `
  query GetUserSubscription($id: ID!) {
    getUserSubscription(id: $id) {
      id
      SubscriberID
      ExpireDate
      ProductID
      TrainerID
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listUserSubscriptions = /* GraphQL */ `
  query ListUserSubscriptions(
    $filter: ModelUserSubscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        SubscriberID
        ExpireDate
        ProductID
        TrainerID
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
