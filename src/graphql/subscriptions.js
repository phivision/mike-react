/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onContentByCreatorID = /* GraphQL */ `
  subscription OnContentByCreatorID($CreatorID: ID!) {
    onContentByCreatorID(CreatorID: $CreatorID) {
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
