import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Player.module.css";
import { useLocation } from "react-router-dom";
import FlippableCard from "../FlippableCardComponent/FlippableCard";

const Player = () => {
	const [relievers, setRelievers] = useState([]);
	const [hitters, setHitters] = useState([]);
	const [startingPitchers, setStartingPitchers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	let location = useLocation();

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

	const handleAddToRelieverRoster = async (player) => {
		try {
			console.log("PLAYER", player);
			await axios.post("http://localhost:8080/api/roster/relievers", player);
			alert("Added to roster!");
		} catch (error) {
			setError("Error adding to roster");
		}
	};

	const handleAddToHitterRoster = async (player) => {
		try {
			console.log("PLAYER", player);
			await axios.post("http://localhost:8080/api/roster/hitters", player);
			alert("Added to roster!");
		} catch (error) {
			setError("Error adding to roster");
		}
	};

	const handleAddToStartingPitchersRoster = async (player) => {
		try {
			console.log("PLAYER", player);
			// Send the player data to the backend to be added to the collection
			await axios.post(
				"http://localhost:8080/api/roster/startingPitchers",
				player
			);
			alert("Added to roster!");
		} catch (error) {
			setError("Error adding to roster");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className={styles.container}>
			<h1>All Baseball Players</h1>

			<section className={styles.category}>
				<div>
					<h2>Relievers</h2>
				</div>
				<div className={styles.cardContainer}>
					{relievers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								handleAdd={handleAddToRelieverRoster}
								location={location.pathname}
							/>
						</div>
					))}
				</div>
			</section>

			<section className={styles.category}>
				<div>
					<h2>Hitters</h2>
				</div>
				<div className={styles.cardContainer}>
					{hitters.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								handleAdd={handleAddToHitterRoster}
								location={location.pathname}
							/>
						</div>
					))}
				</div>
			</section>

			<section className={styles.category}>
				<div>
					<h2>Starting Pitchers</h2>
				</div>
				<div className={styles.cardContainer}>
					{startingPitchers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								handleAdd={handleAddToStartingPitchersRoster}
								location={location.pathname}
							/>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default Player;
