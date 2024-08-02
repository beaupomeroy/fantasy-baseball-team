import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
	return (
		<header className={styles.header}>
			<nav>
				<ul className={styles.navList}>
					<li className={styles.navItem}>
						<Link to="/">Home</Link>
					</li>
					<li className={styles.navItem}>
						<Link to={`/player`}>Player</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/collection">Collection</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/team">Team</Link>
					</li>
				</ul>
			</nav>
			<div className={styles.authButtons}>
				<button className={styles.button}>Sign In</button>
				<button className={styles.button}>Register</button>
			</div>
		</header>
	);
}

export default Header;
