const { gql } = require('apollo-server-express');

// User Model:
/*
      username
      email
      password
      savedBooks: [bookSchema],
  },
*/

const typeDefs = gql`
      type User {
            id: ID!
            username: String!
            email: String!
            bookCount: Int
            savedBooks: [Book]
      }
`

module.exports = typeDefs;
