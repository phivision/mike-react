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
  }
`;
export const createUserSubscriptionTrainer = /* GraphQL */ `
  mutation CreateUserSubscriptionTrainer(
    $input: CreateUserSubscriptionTrainerInput!
    $condition: ModelUserSubscriptionTrainerConditionInput
  ) {
    createUserSubscriptionTrainer(input: $input, condition: $condition) {
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
  }
`;
export const updateUserSubscriptionTrainer = /* GraphQL */ `
  mutation UpdateUserSubscriptionTrainer(
    $input: UpdateUserSubscriptionTrainerInput!
    $condition: ModelUserSubscriptionTrainerConditionInput
  ) {
    updateUserSubscriptionTrainer(input: $input, condition: $condition) {
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
  }
`;
export const deleteUserSubscriptionTrainer = /* GraphQL */ `
  mutation DeleteUserSubscriptionTrainer(
    $input: DeleteUserSubscriptionTrainerInput!
    $condition: ModelUserSubscriptionTrainerConditionInput
  ) {
    deleteUserSubscriptionTrainer(input: $input, condition: $condition) {
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
      Content {
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
      Content {
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
      Content {
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
  }
`;
export const createMessages = /* GraphQL */ `
  mutation CreateMessages(
    $input: CreateMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    createMessages(input: $input, condition: $condition) {
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
  }
`;
export const updateMessages = /* GraphQL */ `
  mutation UpdateMessages(
    $input: UpdateMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    updateMessages(input: $input, condition: $condition) {
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
  }
`;
export const deleteMessages = /* GraphQL */ `
  mutation DeleteMessages(
    $input: DeleteMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    deleteMessages(input: $input, condition: $condition) {
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
  }
`;
