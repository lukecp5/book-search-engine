const jwt = require("jsonwebtoken");

// + set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
	// + function for our authenticated routes
	authMiddleware: function ({ req }) {
		// + allows token to be sent via req.body, req.query, or through headers
		let token = req.body.token || req.query.token || req.headers.authorization;

		// + ["Bearer", "<tokenvalue>"]
		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
			console.log("Header auth token: ", token);
		}

		if (!token) {
			return req;
		}

		// + Verify that the token is valid, and return the decoded token
		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			console.log("Decoded token data: ", data);
			req.user = data;
			console.log(req.user);
		} catch (err) {
			console.log("Invalid token");
			console.error(err);
		}

		return req;
	},
	signToken: function ({ username, email, _id }) {
		const payload = { username, email, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
