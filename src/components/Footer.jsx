import React from "react";
import styles from "./Header.module.css"; // Import the CSS module

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<p>&copy; 2024 Beau Pomeroy's Fantasy Baseball App</p>
			<p>
				<a href="/privacy-policy">Privacy Policy</a> |{" "}
				<a href="/terms-of-service">Terms of Service</a>
			</p>
		</footer>
	);
};

export default Footer;
