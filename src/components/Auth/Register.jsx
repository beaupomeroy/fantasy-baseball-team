import React, { useState } from "react";
import axios from "axios";

function Register() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			console.log("Submitting registration with data:", formData);
			const response = await axios.post("http://localhost:8080/api/register", {
				email: formData.email,
				password: formData.password,
				name: formData.username, // Assuming username is used as the name
			});
			console.log("Registration successful", response.data);
			// Handle success, e.g., redirect to login or show success message
		} catch (err) {
			console.error(
				"Error registering user:",
				err.response?.data || err.message
			);
			setError(
				"Registration failed: " + (err.response?.data?.error || err.message)
			);
		}
	};

	return (
		<div style={{ color: "black" }}>
			<h2>Register</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>Username:</label>
					<input
						type="text"
						name="username"
						value={formData.username}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
				<button type="submit">Register</button>
			</form>
		</div>
	);
}

export default Register;
