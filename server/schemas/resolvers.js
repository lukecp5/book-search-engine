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


      },

      Mutation: {

      },

};