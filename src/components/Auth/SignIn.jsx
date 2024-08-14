import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext"; // Adjust the path as needed

export const useAuth = () => {
	return useContext(AuthContext); // Import useContext from React
};

function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth(); // Access the login function from context

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			console.log("Signing in with", email, password);
			const response = await axios.post("http://localhost:8080/api/signin", {
				email,
				password,
			});
			console.log("Sign-in successful", response.data);
			login(response.data.user); // Update the auth context with user data
			// Redirect or show success message
			// Example: navigate("/dashboard");
		} catch (err) {
			console.error("Error signing in:", err.response?.data || err.message);
			setError("Sign-in failed: " + (err.response?.data?.error || err.message));
		}
	};

	return (
		<div>
			<h2>Sign In</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<button type="submit">Sign In</button>
			</form>
		</div>
	);
}

export default SignIn;
