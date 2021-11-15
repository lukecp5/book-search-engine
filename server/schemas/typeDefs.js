const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type Query {
		me: User
	}

	type User {
		id: ID!
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


      type Auth {
            token: ID!
            user: User
      }

      type Mutation {
            addUser(username: String!, email: String!, password: String!): Auth
      }
`;

module.exports = typeDefs;
