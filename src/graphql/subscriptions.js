/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onContentByCreatorID = /* GraphQL */ `
  subscription OnContentByCreatorID($CreatorID: ID!) {
    onContentByCreatorID(CreatorID: $CreatorID) {
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
export const onUpdateByCreatorID = /* GraphQL */ `
  subscription OnUpdateByCreatorID($CreatorID: ID!) {
    onUpdateByCreatorID(CreatorID: $CreatorID) {
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
export const onDeletionByCreatorID = /* GraphQL */ `
  subscription OnDeletionByCreatorID($CreatorID: ID!) {
    onDeletionByCreatorID(CreatorID: $CreatorID) {
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
export const onMessagesByToUserID = /* GraphQL */ `
  subscription OnMessagesByToUserID($ToUserID: ID!) {
    onMessagesByToUserID(ToUserID: $ToUserID) {
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
