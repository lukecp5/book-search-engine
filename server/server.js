const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const db = require("./config/connection");
// const routes = require('./routes');
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const PORT = process.env.PORT || 3001;

const app = express();

// > Updated to use the new ApolloServer constructor that is required by Apollo Server v3.0+
async function startApolloServer(typeDefs, resolvers) {
	const server = new ApolloServer({ typeDefs, resolvers, context: authMiddleware });
	await server.start();
	server.applyMiddleware({ app, path: "/graphql" });

	db.once("open", () => {
		app.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}${server.graphqlPath}`);
		});
	});
}

startApolloServer(typeDefs, resolvers);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}${server.graphqlPath}`));
// });
