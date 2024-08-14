import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const login = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData)); // Optionally store user info in local storage
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user"); // Optionally remove user info from local storage
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
