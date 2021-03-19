/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const onCreateUserContent = /* GraphQL */ `
  subscription OnCreateUserContent {
    onCreateUserContent {
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
export const onUpdateUserContent = /* GraphQL */ `
  subscription OnUpdateUserContent {
    onUpdateUserContent {
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
export const onDeleteUserContent = /* GraphQL */ `
  subscription OnDeleteUserContent {
    onDeleteUserContent {
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
export const onCreateUserSubscription = /* GraphQL */ `
  subscription OnCreateUserSubscription {
    onCreateUserSubscription {
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
export const onUpdateUserSubscription = /* GraphQL */ `
  subscription OnUpdateUserSubscription {
    onUpdateUserSubscription {
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
export const onDeleteUserSubscription = /* GraphQL */ `
  subscription OnDeleteUserSubscription {
    onDeleteUserSubscription {
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
