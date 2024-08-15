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
						<Link to="/roster">Roster</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/starting-lineup">Starting Lineup</Link>
					</li>
				</ul>
			</nav>
			{/* <div className={styles.authButtons}>
				<Link to="/signin">
					<button className={styles.button}>Sign In</button>
				</Link>
				<Link to="/register">
					<button className={styles.button}>Register</button>
				</Link>
			</div> */}
		</header>
	);
}

export default Header;
