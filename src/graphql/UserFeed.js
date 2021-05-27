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
                }
                id
              }
            }
            id
            LastName
            FirstName
            UserImage
            Description
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
            id
            LastName
            FirstName
            UserImage
            Description
          }
        }`;
