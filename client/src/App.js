import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// > Create the GraphQL API endpoint so that we can use it in our components
const httpLink = createHttpLink({
	uri: "/graphql",
});

// > Request middleware that passes a JWT token with every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
	// > If we have a token, store it to 'token' so we can add it to our headers
	const token = localStorage.getItem("id_token");
	// > Return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	// > Set up our link to the GraphQL API endpoint using the `authLink` and `httpLink`
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App() {
	return (
		// > Wrap the entire app in the `ApolloProvider` component, which will pass down the client to every child component
		<ApolloProvider client={client}>
			<Router>
				<>
					<Navbar />
					<Switch>
						<Route exact path="/" component={SearchBooks} />
						<Route exact path="/saved" component={SavedBooks} />
						<Route render={() => <h1 className="display-2">Wrong page!</h1>} />
					</Switch>
				</>
			</Router>
		</ApolloProvider>
	);
}

export default App;
