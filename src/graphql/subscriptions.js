/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $UserID: Int
    $UserRole: String
    $UserName: String
    $RegDate: String
    $Gender: String
  ) {
    onCreateUserProfile(
      UserID: $UserID
      UserRole: $UserRole
      UserName: $UserName
      RegDate: $RegDate
      Gender: $Gender
    ) {
      UserID
      UserRole
      UserName
      RegDate
      UserImage
      Gender
      Birthday
      Height
      Weight
      Price
      Email
      StripeID
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $UserID: Int
    $UserRole: String
    $UserName: String
    $RegDate: String
    $Gender: String
  ) {
    onUpdateUserProfile(
      UserID: $UserID
      UserRole: $UserRole
      UserName: $UserName
      RegDate: $RegDate
      Gender: $Gender
    ) {
      UserID
      UserRole
      UserName
      RegDate
      UserImage
      Gender
      Birthday
      Height
      Weight
      Price
      Email
      StripeID
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $UserID: Int
    $UserRole: String
    $UserName: String
    $RegDate: String
    $Gender: String
  ) {
    onDeleteUserProfile(
      UserID: $UserID
      UserRole: $UserRole
      UserName: $UserName
      RegDate: $RegDate
      Gender: $Gender
    ) {
      UserID
      UserRole
      UserName
      RegDate
      UserImage
      Gender
      Birthday
      Height
      Weight
      Price
      Email
      StripeID
    }
  }
`;
