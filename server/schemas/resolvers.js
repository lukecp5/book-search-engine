const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
      Query: {
            // > Query that will find a user(if one is present) in the context provided by the authMiddleware, and return the user.
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id });
			}
			throw new AuthenticationError("You need to be logged in!");
		},
	},

	Mutation: {
		// > Mutation that will create a new user in the database.
		createUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);
			return { token, user };
		},

		// > Mutation that will update a user in the database by adding a book to their list of books.
		saveBook: async (parent, { bookData }, context) => {
			if (context.user) {
				const user = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $push: { savedBooks: { bookData } } },
					{ new: true }
				);
				return user;
			}
		},

		// > This is the mutation that will be used to delete a book from the user's saved books.
		deleteBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const user = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);
				return user;
			}
		},

		// > This is the mutation that will be used to verify the user's credentials and log them in.
		login: async (parent, { email, password }, context) => {
			// > Find the user by their email address
			const user = await User.findOne({ email });

			// > If the user is not found, throw an authentication error
			if (!user) {
				throw new AuthenticationError("Invalid email or password");
			}

			// > Evaluate the submitted password using the isValidPassword method that is provided by the userSchema
			// > If the password is incorrect, throw a non-descript authentication error
			const isValid = await user.isValidPassword(password);
			if (!isValid) {
				throw new AuthenticationError("Invalid username or password");
			}

			// > If the password is correct, return the token generated by the signToken function from the auth middleware
			const token = signToken(user);
			return { token, user };
		},
	},
};
