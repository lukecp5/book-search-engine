import React, { useState, useEffect } from "react";
import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";

// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const { useQuery, useMutation } = require("@apollo/client");
const { QUERY_ME, REMOVE_BOOK } = require("../utils/queries");

/*

DONE: Remove the useEffect() Hook that sets the state for UserData.

DONE: Instead, use the useQuery() Hook to execute the GET_ME query on load and save it to a variable named userData.

DONE: Use the useMutation() Hook to execute the REMOVE_BOOK mutation in the handleDeleteBook() function instead of the deleteBook() function that's imported from API file. (Make sure you keep the removeBookId() function in place!)
import { QUERY_ME } from './../../../../finished-hw/client/src/utils/queries';

*/

const SavedBooks = () => {
	// const [userData, setUserData] = useState({});
	const { loading, data } = useQuery(QUERY_ME);
	const [removeBook] = useMutation(REMOVE_BOOK);

	const userData = data ? data.me : {};

	console.log(userData);
	// > A function that removes a book from the user's saved books based on the book's id and the user's id from the Auth in context.
	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			console.log("You must be logged in to delete a book.");
			return false;
		}

		try {
			const { data } = await removeBook({
				variables: { bookId },
			});
			// upon success, remove book's id from localStorage
			removeBookId(bookId);
		} catch (err) {
			console.error(err);
		}
	};

	// > While the user's data is loading, display a loading message
	if (loading) {
		return <h2>LOADING...</h2>;
	}

	return (
		<>
			<Jumbotron fluid className="text-light bg-dark">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</Jumbotron>
			<Container>
				<h2>
					{userData.savedBooks?.length
						? `Viewing ${userData.savedBooks.length} saved ${
								userData.savedBooks.length === 1 ? "book" : "books"
						  }:`
						: "You have no saved books!"}
				</h2>
				<CardColumns>
					{userData.savedBooks?.map((book) => {
						return (
							<Card key={book.bookId} border="dark">
								{book.image ? (
									<Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
								) : null}
								<Card.Body>
									<Card.Title>{book.title}</Card.Title>
									<p className="small">Authors: {book.authors}</p>
									<Card.Text>{book.description}</Card.Text>
									<Button
										className="btn-block btn-danger"
										onClick={() => handleDeleteBook(book.bookId)}
									>
										Delete this Book!
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				</CardColumns>
			</Container>
		</>
	);
};

export default SavedBooks;
