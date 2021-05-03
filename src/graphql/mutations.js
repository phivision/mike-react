/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $input: CreateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    createUserProfile(input: $input, condition: $condition) {
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
      Description
      Biography
      createdAt
      updatedAt
      owner
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
          ContentName
          Description
          Title
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $input: UpdateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    updateUserProfile(input: $input, condition: $condition) {
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
      Description
      Biography
      createdAt
      updatedAt
      owner
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
          ContentName
          Description
          Title
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $input: DeleteUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    deleteUserProfile(input: $input, condition: $condition) {
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
      Description
      Biography
      createdAt
      updatedAt
      owner
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
          ContentName
          Description
          Title
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
export const createUserSubscriptionTrainer = /* GraphQL */ `
  mutation CreateUserSubscriptionTrainer(
    $input: CreateUserSubscriptionTrainerInput!
    $condition: ModelUserSubscriptionTrainerConditionInput
  ) {
    createUserSubscriptionTrainer(input: $input, condition: $condition) {
      id
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
      owner
    }
  }
`;
export const updateUserSubscriptionTrainer = /* GraphQL */ `
  mutation UpdateUserSubscriptionTrainer(
    $input: UpdateUserSubscriptionTrainerInput!
    $condition: ModelUserSubscriptionTrainerConditionInput
  ) {
    updateUserSubscriptionTrainer(input: $input, condition: $condition) {
      id
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
      owner
    }
  }
`;
export const deleteUserSubscriptionTrainer = /* GraphQL */ `
  mutation DeleteUserSubscriptionTrainer(
    $input: DeleteUserSubscriptionTrainerInput!
    $condition: ModelUserSubscriptionTrainerConditionInput
  ) {
    deleteUserSubscriptionTrainer(input: $input, condition: $condition) {
      id
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
      owner
    }
  }
`;
export const createUserFavoriteContent = /* GraphQL */ `
  mutation CreateUserFavoriteContent(
    $input: CreateUserFavoriteContentInput!
    $condition: ModelUserFavoriteContentConditionInput
  ) {
    createUserFavoriteContent(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
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
      owner
      Content {
        id
        CreatorID
        ContentName
        Description
        Title
        Level
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
        FavoriteUser {
          nextToken
        }
        owner
      }
    }
  }
`;
export const updateUserFavoriteContent = /* GraphQL */ `
  mutation UpdateUserFavoriteContent(
    $input: UpdateUserFavoriteContentInput!
    $condition: ModelUserFavoriteContentConditionInput
  ) {
    updateUserFavoriteContent(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
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
      owner
      Content {
        id
        CreatorID
        ContentName
        Description
        Title
        Level
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
        FavoriteUser {
          nextToken
        }
        owner
      }
    }
  }
`;
export const deleteUserFavoriteContent = /* GraphQL */ `
  mutation DeleteUserFavoriteContent(
    $input: DeleteUserFavoriteContentInput!
    $condition: ModelUserFavoriteContentConditionInput
  ) {
    deleteUserFavoriteContent(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
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
      owner
      Content {
        id
        CreatorID
        ContentName
        Description
        Title
        Level
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
        FavoriteUser {
          nextToken
        }
        owner
      }
    }
  }
`;
export const createUserContent = /* GraphQL */ `
  mutation CreateUserContent(
    $input: CreateUserContentInput!
    $condition: ModelUserContentConditionInput
  ) {
    createUserContent(input: $input, condition: $condition) {
      id
      CreatorID
      ContentName
      Description
      Title
      Level
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
export const updateUserContent = /* GraphQL */ `
  mutation UpdateUserContent(
    $input: UpdateUserContentInput!
    $condition: ModelUserContentConditionInput
  ) {
    updateUserContent(input: $input, condition: $condition) {
      id
      CreatorID
      ContentName
      Description
      Title
      Level
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
export const deleteUserContent = /* GraphQL */ `
  mutation DeleteUserContent(
    $input: DeleteUserContentInput!
    $condition: ModelUserContentConditionInput
  ) {
    deleteUserContent(input: $input, condition: $condition) {
      id
      CreatorID
      ContentName
      Description
      Title
      Level
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
