import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
// OLD REST API USER CREATION FUNCTION --- import { createUser } from '../utils/API';

import Auth from "../utils/auth";

const SignupForm = () => {
	// > Set initial form state
	const [userFormData, setUserFormData] = useState({ username: "", email: "", password: "" });
	// > Set state for form validation
	const [validated] = useState(false);
	// > Set state for alert (success/failure)
	const [showAlert, setShowAlert] = useState(false);
	// > Create mutation function for the ADD_USER mutation
	const [addUser] = useMutation(ADD_USER);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUserFormData({ ...userFormData, [name]: value });
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		// > Validate form data
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		try {
			// > Create new user in the database using the ADD_USER mutation
			const { data } = await addUser({
				variables: { ...userFormData },
			});

			// > Extract token from newly created user returned by addUser mutation and log user in
			Auth.login(data.addUser.token);
		} catch (err) {
			console.error(err);
		}

		setUserFormData({
			username: "",
			email: "",
			password: "",
		});
	};

	return (
		<>
			{/* This is needed for the validation functionality above */}
			<Form noValidate validated={validated} onSubmit={handleFormSubmit}>
				{/* show alert if server response is bad */}
				<Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
					Something went wrong with your signup!
				</Alert>

				<Form.Group>
					<Form.Label htmlFor="username">Username</Form.Label>
					<Form.Control
						type="text"
						placeholder="Your username"
						name="username"
						onChange={handleInputChange}
						value={userFormData.username}
						required
					/>
					<Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<Form.Label htmlFor="email">Email</Form.Label>
					<Form.Control
						type="email"
						placeholder="Your email address"
						name="email"
						onChange={handleInputChange}
						value={userFormData.email}
						required
					/>
					<Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<Form.Label htmlFor="password">Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Your password"
						name="password"
						onChange={handleInputChange}
						value={userFormData.password}
						required
					/>
					<Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
				</Form.Group>
				<Button
					disabled={!(userFormData.username && userFormData.email && userFormData.password)}
					type="submit"
					variant="success"
				>
					Submit
				</Button>
			</Form>
		</>
	);
};

export default SignupForm;
