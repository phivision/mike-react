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
        nextToken
      }
      Favorites {
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
      createdAt
      updatedAt
      owner
      Subscriptions {
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
        nextToken
      }
      Favorites {
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
      createdAt
      updatedAt
      owner
      Subscriptions {
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
        nextToken
      }
      Favorites {
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
        Subscriptions {
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
        Subscriptions {
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
        Subscriptions {
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
