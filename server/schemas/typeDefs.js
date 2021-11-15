const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type Query {
		me: User
	}

	type User {
		_id: ID!
		username: String!
		email: String!
		bookCount: Int
		savedBooks: [Book]
	}

	type Book {
		bookId: ID!
		title: String!
		authors: String!
		description: String!
		link: String!
		image: String!
	}

  # GraphQL input type for saving a book that is received from Google Books API search to a user's saved books
      input BookInput {
            bookId
            title: String!
            authors: [ String ]
            description: String!
            link: String
            image: String
      }

      type Auth {
            token: ID!
            user: User
      }

      type Mutation {
            createUser(username: String!, email: String!, password: String!): Auth
            login(email: String!, password: String!): Auth
            saveBook(bookData: BookInput!): User
            deleteBook(bookId: ID!): User
      }
`;

module.exports = typeDefs;
