const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {

// > Query that will find a user(if one is present) in the context provided by the authMiddleware, and return the user.
      Query: {
            me: async (parent, args, context) => {
                  if (context.user) {
                    return User.findOne({ _id: context.user._id });
                  }
                  throw new AuthenticationError('You need to be logged in!');
                },
      },

// NOTE: Mutations ported from user-controller.js
      Mutation: {
            // > Mutation that will create a new user in the database.
            createUser: async (parent, args, context) => {

            },

            // > Mutation that will update a user in the database by adding a book to their list of books.
            saveBook: async (parent, args, context) => {
                        
                  },
            
            // > This is the mutation that will be used to delete a book from the user's saved books.
            deleteBook: async (parent, args, context) => {
            },
            // > This is the mutation that will be used to verify the user's credentials and log them in.
            login: async (parent, { email, password }, context) => {

                  // > Find the user by their email address
                  const user = await User.findOne({ email });

                  // > If the user is not found, throw an authentication error
                  if (!user) {
                    throw new AuthenticationError(
                      'Invalid email or password'
                    );
                  }

                  // > Evaluate the submitted password using the isValidPassword method that is provided by the userSchema
                  // > If the password is incorrect, throw a non-descript authentication error
                  const isValid = await user.isValidPassword(password);
                  if (!isValid) {
                    throw new AuthenticationError(
                      'Invalid username or password'
                    );
                  }

                  // > If the password is correct, return the token generated by the signToken function from the auth middleware
                  const token = signToken(user);
                  return { token, user };
            }
      },

};