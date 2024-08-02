import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Collection.module.css";

const Collection = () => {
	const [collectionHitters, setCollectionHitters] = useState([]);
	const [collectionRelievers, setCollectionRelievers] = useState([]);
	const [collectionStartingPitchers, setCollectionStartingPitchers] = useState(
		[]
	);
	const [error, setError] = useState("");

	useEffect(() => {
		// Reset collection data when the component mounts
		setCollectionHitters([]);
		setCollectionRelievers([]);
		setCollectionStartingPitchers([]);

		const fetchCollection = async () => {
			console.log("FETCH CALL");
			try {
				// Fetch all data in parallel
				const [hittersResponse, relieversResponse, startingPitchersResponse] =
					await Promise.all([
						axios.get("http://localhost:8080/api/collection/hitters"),
						axios.get("http://localhost:8080/api/collection/relievers"),
						axios.get("http://localhost:8080/api/collection/startingPitchers"),
					]);

				// Log the response data
				console.log("HITTERS DATA", hittersResponse.data);
				console.log("RELIEVERS DATA", relieversResponse.data);
				console.log("STARTING PITCHERS DATA", startingPitchersResponse.data);

				// Set the state with the response data
				setCollectionHitters(hittersResponse.data || []);
				setCollectionRelievers(relieversResponse.data || []);
				setCollectionStartingPitchers(startingPitchersResponse.data || []);
			} catch (error) {
				console.log("ERROR", error);
				setError("Error fetching collection");
			}
		};

		fetchCollection();
	}, []);

	if (error) return <div>{error}</div>;

	return (
		<div className={styles.container}>
			<h1>My Collection</h1>

			<section className={styles.category}>
				<h2>Relievers</h2>
				<ul>
					{collectionRelievers &&
						collectionRelievers.map((player) => (
							<li key={player._id || player.name} className={styles.card}>
								<img
									src={player.imageUrl || "default-image-url"} // Fallback URL in case imageUrl is missing
									alt={player.name}
									className={styles.image}
								/>
								<h3>{player.name}</h3>
								<p>Position: {player.position}</p>
								<p>ERA: {player.era}</p>
								<p>Saves: {player.saves}</p>
								<p>Strikeouts: {player.strikeouts}</p>
							</li>
						))}
				</ul>
			</section>

			<section className={styles.category}>
				<h2>Hitters</h2>
				<ul>
					{collectionHitters &&
						collectionHitters.map((player) => (
							<li key={player._id || player.name} className={styles.card}>
								<img
									src={player.imageUrl || "default-image-url"} // Fallback URL in case imageUrl is missing
									alt={player.name}
									className={styles.image}
								/>
								<h3>{player.name}</h3>
								<p>Position: {player.position}</p>
								<p>Batting Avg: {player.battingAvg}</p>
								<p>Home Runs: {player.homeRuns}</p>
								<p>RBIs: {player.RBIs}</p>
							</li>
						))}
				</ul>
			</section>

			<section className={styles.category}>
				<h2>Starting Pitchers</h2>
				<ul>
					{collectionStartingPitchers &&
						collectionStartingPitchers.map((player) => (
							<li key={player._id || player.name} className={styles.card}>
								<img
									src={player.imageUrl || "default-image-url"} // Fallback URL in case imageUrl is missing
									alt={player.name}
									className={styles.image}
								/>
								<h3>{player.name}</h3>
								<p>Position: {player.position}</p>
								<p>ERA: {player.era}</p>
								<p>Wins: {player.wins}</p>
								<p>Strikeouts: {player.strikeouts}</p>
							</li>
						))}
				</ul>
			</section>
		</div>
	);
};

export default Collection;
