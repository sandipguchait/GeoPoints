
export const ME_QUERY = `
  {
    me{
      _id
      name
      email
      picture
    }
  }
`;

export const GET_PINS = `
  {
    getPins {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          email
          name
          picture
        }
      }
    }
  }
`