/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserSubscriptionTrainer = /* GraphQL */ `
  subscription OnCreateUserSubscriptionTrainer {
    onCreateUserSubscriptionTrainer {
      id
      createdAt
      updatedAt
      Trainer {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
        createdAt
        updatedAt
        owner
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
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
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
export const onUpdateUserSubscriptionTrainer = /* GraphQL */ `
  subscription OnUpdateUserSubscriptionTrainer {
    onUpdateUserSubscriptionTrainer {
      id
      createdAt
      updatedAt
      Trainer {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
        createdAt
        updatedAt
        owner
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
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
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
export const onDeleteUserSubscriptionTrainer = /* GraphQL */ `
  subscription OnDeleteUserSubscriptionTrainer {
    onDeleteUserSubscriptionTrainer {
      id
      createdAt
      updatedAt
      Trainer {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
        createdAt
        updatedAt
        owner
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
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
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
export const onCreateUserFavoriteContent = /* GraphQL */ `
  subscription OnCreateUserFavoriteContent {
    onCreateUserFavoriteContent {
      id
      createdAt
      updatedAt
      User {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
        createdAt
        updatedAt
        owner
        Contents {
          nextToken
        }
      }
      owner
      Content {
        id
        CreatorID
        ContentName
        Description
        Level
        Length
        IsDemo
        ViewCount
        Thumbnail
        Preview
        FavoriteUser {
          nextToken
        }
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
          BgImage
          BgTitle
          LastName
          FirstName
          UserRole
          Weight
          Description
          Biography
          createdAt
          updatedAt
          owner
        }
        owner
      }
    }
  }
`;
export const onUpdateUserFavoriteContent = /* GraphQL */ `
  subscription OnUpdateUserFavoriteContent {
    onUpdateUserFavoriteContent {
      id
      createdAt
      updatedAt
      User {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
        createdAt
        updatedAt
        owner
        Contents {
          nextToken
        }
      }
      owner
      Content {
        id
        CreatorID
        ContentName
        Description
        Level
        Length
        IsDemo
        ViewCount
        Thumbnail
        Preview
        FavoriteUser {
          nextToken
        }
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
          BgImage
          BgTitle
          LastName
          FirstName
          UserRole
          Weight
          Description
          Biography
          createdAt
          updatedAt
          owner
        }
        owner
      }
    }
  }
`;
export const onDeleteUserFavoriteContent = /* GraphQL */ `
  subscription OnDeleteUserFavoriteContent {
    onDeleteUserFavoriteContent {
      id
      createdAt
      updatedAt
      User {
        id
        Birthday
        Email
        Gender
        Height
        Price
        RegDate
        StripeID
        UserImage
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
        createdAt
        updatedAt
        owner
        Contents {
          nextToken
        }
      }
      owner
      Content {
        id
        CreatorID
        ContentName
        Description
        Level
        Length
        IsDemo
        ViewCount
        Thumbnail
        Preview
        FavoriteUser {
          nextToken
        }
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
          BgImage
          BgTitle
          LastName
          FirstName
          UserRole
          Weight
          Description
          Biography
          createdAt
          updatedAt
          owner
        }
        owner
      }
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile {
    onCreateUserProfile {
      id
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      UserImage
      BgImage
      BgTitle
      LastName
      FirstName
      UserRole
      Weight
      Description
      Biography
      Favorites {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Subscriptions {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Users {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
      Contents {
        items {
          id
          CreatorID
          ContentName
          Description
          Level
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile {
    onUpdateUserProfile {
      id
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      UserImage
      BgImage
      BgTitle
      LastName
      FirstName
      UserRole
      Weight
      Description
      Biography
      Favorites {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Subscriptions {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Users {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
      Contents {
        items {
          id
          CreatorID
          ContentName
          Description
          Level
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile {
    onDeleteUserProfile {
      id
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      UserImage
      BgImage
      BgTitle
      LastName
      FirstName
      UserRole
      Weight
      Description
      Biography
      Favorites {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Subscriptions {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      Users {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
      Contents {
        items {
          id
          CreatorID
          ContentName
          Description
          Level
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
export const onCreateUserContent = /* GraphQL */ `
  subscription OnCreateUserContent {
    onCreateUserContent {
      id
      CreatorID
      ContentName
      Description
      Level
      Length
      IsDemo
      ViewCount
      Thumbnail
      Preview
      FavoriteUser {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
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
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
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
export const onUpdateUserContent = /* GraphQL */ `
  subscription OnUpdateUserContent {
    onUpdateUserContent {
      id
      CreatorID
      ContentName
      Description
      Level
      Length
      IsDemo
      ViewCount
      Thumbnail
      Preview
      FavoriteUser {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
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
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
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
export const onDeleteUserContent = /* GraphQL */ `
  subscription OnDeleteUserContent {
    onDeleteUserContent {
      id
      CreatorID
      ContentName
      Description
      Level
      Length
      IsDemo
      ViewCount
      Thumbnail
      Preview
      FavoriteUser {
        items {
          id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
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
        BgImage
        BgTitle
        LastName
        FirstName
        UserRole
        Weight
        Description
        Biography
        Favorites {
          nextToken
        }
        Subscriptions {
          nextToken
        }
        Users {
          nextToken
        }
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
