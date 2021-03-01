/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $Gender: String
    $RegDate: String
    $CognitoID: String
    $UserName: String
    $UserRole: String
  ) {
    onCreateUserProfile(
      Gender: $Gender
      RegDate: $RegDate
      CognitoID: $CognitoID
      UserName: $UserName
      UserRole: $UserRole
    ) {
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      CognitoID
      UserImage
      UserName
      UserRole
      Weight
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $Gender: String
    $RegDate: String
    $CognitoID: String
    $UserName: String
    $UserRole: String
  ) {
    onDeleteUserProfile(
      Gender: $Gender
      RegDate: $RegDate
      CognitoID: $CognitoID
      UserName: $UserName
      UserRole: $UserRole
    ) {
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      CognitoID
      UserImage
      UserName
      UserRole
      Weight
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $Gender: String
    $RegDate: String
    $CognitoID: String
    $UserName: String
    $UserRole: String
  ) {
    onUpdateUserProfile(
      Gender: $Gender
      RegDate: $RegDate
      CognitoID: $CognitoID
      UserName: $UserName
      UserRole: $UserRole
    ) {
      Birthday
      Email
      Gender
      Height
      Price
      RegDate
      StripeID
      CognitoID
      UserImage
      UserName
      UserRole
      Weight
    }
  }
`;
