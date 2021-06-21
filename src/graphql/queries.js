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
      LandingURL
      TokenBalance
      createdAt
      updatedAt
      owner
      Subscriptions {
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
      Users {
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
      Favorites {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Contents {
        items {
          id
          CreatorID
          createdAt
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
          updatedAt
          owner
        }
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
        LandingURL
        TokenBalance
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
        LandingURL
        TokenBalance
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
      nextToken
    }
  }
`;
export const profilesByURL = /* GraphQL */ `
  query ProfilesByURL(
    $LandingURL: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    profilesByURL(
      LandingURL: $LandingURL
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
        LandingURL
        TokenBalance
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
        LandingURL
        TokenBalance
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
        LandingURL
        TokenBalance
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
        LandingURL
        TokenBalance
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
          LandingURL
          TokenBalance
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
          LandingURL
          TokenBalance
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
export const getUserContent = /* GraphQL */ `
  query GetUserContent($id: ID!) {
    getUserContent(id: $id) {
      id
      CreatorID
      createdAt
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
        LandingURL
        TokenBalance
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
      FavoriteUser {
        items {
          id
          createdAt
          updatedAt
          owner
        }
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
        createdAt
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
          LandingURL
          TokenBalance
          createdAt
          updatedAt
          owner
        }
        FavoriteUser {
          nextToken
        }
        owner
      }
      nextToken
    }
  }
`;
export const byContentCreatedAt = /* GraphQL */ `
  query ByContentCreatedAt(
    $CreatorID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserContentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    byContentCreatedAt(
      CreatorID: $CreatorID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        CreatorID
        createdAt
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
          LandingURL
          TokenBalance
          createdAt
          updatedAt
          owner
        }
        FavoriteUser {
          nextToken
        }
        owner
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      PostMessages
      FromUserID
      ToUserID
      createdAt
      Type
      Status
      updatedAt
      FromUser {
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
        LandingURL
        TokenBalance
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
      ToUser {
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
        LandingURL
        TokenBalance
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
      owner
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        PostMessages
        FromUserID
        ToUserID
        createdAt
        Type
        Status
        updatedAt
        FromUser {
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
          LandingURL
          TokenBalance
          createdAt
          updatedAt
          owner
        }
        ToUser {
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
          LandingURL
          TokenBalance
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
export const messageByToUserID = /* GraphQL */ `
  query MessageByToUserID(
    $ToUserID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messageByToUserID(
      ToUserID: $ToUserID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        PostMessages
        FromUserID
        ToUserID
        createdAt
        Type
        Status
        updatedAt
        FromUser {
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
          LandingURL
          TokenBalance
          createdAt
          updatedAt
          owner
        }
        ToUser {
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
          LandingURL
          TokenBalance
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
export const messageByFromUserID = /* GraphQL */ `
  query MessageByFromUserID(
    $FromUserID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messageByFromUserID(
      FromUserID: $FromUserID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        PostMessages
        FromUserID
        ToUserID
        createdAt
        Type
        Status
        updatedAt
        FromUser {
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
          LandingURL
          TokenBalance
          createdAt
          updatedAt
          owner
        }
        ToUser {
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
          LandingURL
          TokenBalance
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
