/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      Birthday
      Email
      Gender
      Height
      RegDate
      StripeID
      UserImage
      BgImage
      BgTitle
      LastName
      FirstName
      UserRole
      Weight
      IsVerified
      Description
      Biography
      createdAt
      updatedAt
      owner
      Subscriptions {
        nextToken
      }
      Users {
        nextToken
      }
      Favorites {
        nextToken
      }
      Contents {
        nextToken
      }
    }
  }
`;
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
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        IsVerified
        Description
        Biography
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const profilesByStripeID = /* GraphQL */ `
  query ProfilesByStripeID(
    $StripeID: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    profilesByStripeID(
      StripeID: $StripeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Birthday
        Email
        Gender
        Height
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        IsVerified
        Description
        Biography
        createdAt
        updatedAt
        owner
      }
      nextToken
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
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        IsVerified
        Description
        Biography
        createdAt
        updatedAt
        owner
      }
      nextToken
      total
    }
  }
`;
export const getUserSubscriptionTrainer = /* GraphQL */ `
  query GetUserSubscriptionTrainer($id: ID!) {
    getUserSubscriptionTrainer(id: $id) {
      id
      StripeID
      ExpireDate
      CancelAtPeriodEnd
      createdAt
      updatedAt
      Trainer {
        id
        Birthday
        Email
        Gender
        Height
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        IsVerified
        Description
        Biography
        createdAt
        updatedAt
        owner
      }
      User {
        id
        Birthday
        Email
        Gender
        Height
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        IsVerified
        Description
        Biography
        createdAt
        updatedAt
        owner
      }
      owner
    }
  }
`;
export const listUserSubscriptionTrainers = /* GraphQL */ `
  query ListUserSubscriptionTrainers(
    $filter: ModelUserSubscriptionTrainerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserSubscriptionTrainers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        StripeID
        ExpireDate
        CancelAtPeriodEnd
        createdAt
        updatedAt
        owner
      }
      nextToken
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
      Title
      Level
      Length
      IsDemo
      TranscodeReady
      ViewCount
      Thumbnail
      Preview
      Segments
      createdAt
      updatedAt
      Creator {
        id
        Birthday
        Email
        Gender
        Height
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        IsVerified
        Description
        Biography
        createdAt
        updatedAt
        owner
      }
      FavoriteUser {
        nextToken
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
        Title
        Level
        Length
        IsDemo
        TranscodeReady
        ViewCount
        Thumbnail
        Preview
        Segments
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const contentByName = /* GraphQL */ `
  query ContentByName(
    $ContentName: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserContentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contentByName(
      ContentName: $ContentName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        CreatorID
        ContentName
        Description
        Title
        Level
        Length
        IsDemo
        TranscodeReady
        ViewCount
        Thumbnail
        Preview
        Segments
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
