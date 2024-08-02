import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Player.module.css";

const Player = () => {
	const [relievers, setRelievers] = useState([]);
	const [hitters, setHitters] = useState([]);
	const [startingPitchers, setStartingPitchers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [relieversResponse, hittersResponse, startingPitchersResponse] =
					await Promise.all([
						axios.get("http://localhost:8080/api/top-relievers"),
						axios.get("http://localhost:8080/api/top-hitters"),
						axios.get("http://localhost:8080/api/top-starting-pitchers"),
					]);

				setRelievers(relieversResponse.data);
				setHitters(hittersResponse.data);
				setStartingPitchers(startingPitchersResponse.data);
			} catch (error) {
				setError("Error fetching data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);
	const handleAddToRelieverCollection = async (player) => {
		try {
			console.log("PLAYER", player);
			// Send the player data to the backend to be added to the collection
			await axios.post(
				"http://localhost:8080/api/collection/relievers",
				player
			);
			alert("Added to collection!");
		} catch (error) {
			setError("Error adding to collection");
		}
	};

	const handleAddToHitterCollection = async (player) => {
		try {
			console.log("PLAYER", player);
			// Send the player data to the backend to be added to the collection
			await axios.post("http://localhost:8080/api/collection/hitters", player);
			alert("Added to collection!");
		} catch (error) {
			setError("Error adding to collection");
		}
	};

	const handleAddToStartingPitchersCollection = async (player) => {
		try {
			console.log("PLAYER", player);
			// Send the player data to the backend to be added to the collection
			await axios.post(
				"http://localhost:8080/api/collection/startingPitchers",
				player
			);
			alert("Added to collection!");
		} catch (error) {
			setError("Error adding to collection");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className={styles.container}>
			<h1>Top Baseball Players</h1>

			<section className={styles.category}>
				<h2>Top Relievers</h2>
				<ul>
					{relievers.map((player) => (
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
							<button onClick={() => handleAddToRelieverCollection(player)}>
								Add to Collection
							</button>
						</li>
					))}
				</ul>
			</section>

			<section className={styles.category}>
				<h2>Top Hitters</h2>
				<ul>
					{hitters.map((player) => (
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
							<button onClick={() => handleAddToHitterCollection(player)}>
								Add to Collection
							</button>
						</li>
					))}
				</ul>
			</section>

			<section className={styles.category}>
				<h2>Top Starting Pitchers</h2>
				<ul>
					{startingPitchers.map((player) => (
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
							<button
								onClick={() => handleAddToStartingPitchersCollection(player)}
							>
								Add to Collection
							</button>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
};

export default Player;
