const { User } = require('../models');



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
            getSingleUser: async (parent, args, context) => {
            },
            createUser: async (parent, args, context) => {

            },
            saveBook: async (parent, args, context) => {
                        
                  },
            deleteBook: async (parent, args, context) => {
            },
            login: async (parent, { email, password }, context) => {

                  // > Find the user by their email address
                  const user = await User.findOne({ email });

                  // > If the user is not found, throw an authentication error
                  if (!user) {
                    throw new AuthenticationError(
                      'Invalid email or password'
                    );
                  }


            }
      },

};