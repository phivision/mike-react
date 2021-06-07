export const deleteUserFavoriteContent = /* GraphQL */ `
  mutation DeleteUserFavoriteContent($input: DeleteUserFavoriteContentInput!) {
    deleteUserFavoriteContent(input: $input) {
      User {
        Favorites {
          items {
            Content {
              id
              ContentName
              Title
              Thumbnail
              createdAt
              Description
              Segments
              owner
            }
            id
          }
        }
      }
    }
  }
`;

export const removeDeletedFavoriteContent = /* GraphQL */ `
  mutation DeleteUserFavoriteContent($input: DeleteUserFavoriteContentInput!) {
    deleteUserFavoriteContent(input: $input) {
      id
    }
  }
`;

export const createUserFavoriteContent = /* GraphQL */ `
  mutation CreateUserFavoriteContent($input: CreateUserFavoriteContentInput!) {
    createUserFavoriteContent(input: $input) {
      User {
        Favorites {
          items {
            Content {
              id
              ContentName
              Title
              Thumbnail
              createdAt
              Description
              Segments
              owner
            }
            id
          }
        }
      }
    }
  }
`;
export const userProfileQuery = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Subscriptions {
              items {
                Trainer {
                  Contents {
                    items {
                      id
                      ContentName
                      Description
                      Title
                      createdAt
                      Thumbnail
                      Segments
                      owner
                      Creator {
                        UserImage
                        FirstName
                        LastName
                        id
                      }
                    }
                  }
                  FirstName
                  LastName
                  id
                  UserImage
                }
              }
            }
            id
            LastName
            FirstName
            UserImage
            Description
          }
        }`;

export const userFavoriteQuery = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Favorites {
              items {
                Content {
                  id
                  ContentName
                  Title
                  Thumbnail
                  createdAt
                  owner
                  Description
                  Segments
                }
                id
              }
            }
          }
        }`;

export const userFavoriteIdQuery = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Favorites {
              items {
                id
              }
            }
          }
        }`;

export const trainerProfileQuery = `query GetUserProfile ($id: ID!) {
          getUserProfile(id: $id) {
            Contents {
              items {
                id
                ContentName
                Description
                Title
                createdAt
                Thumbnail
                Segments
                Creator{
                  UserImage
                  FirstName
                  LastName
                  id
                }
                owner
              }
            }
            id
            LastName
            FirstName
            UserImage
            Description
          }
        }`;
