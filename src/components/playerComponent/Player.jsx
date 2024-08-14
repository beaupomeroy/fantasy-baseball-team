import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Player.module.css";
import { useLocation } from "react-router-dom";
import FlippableCard from "../FlippableCardComponent/FlippableCard";

const Player = () => {
	const [relievers, setRelievers] = useState([]);
	const [hitters, setHitters] = useState([]);
	const [startingPitchers, setStartingPitchers] = useState([]);
	const [rosterCounts, setRosterCounts] = useState({
		relievers: 0,
		hitters: 0,
		startingPitchers: 0,
	});
	const [existingRoster, setExistingRoster] = useState({
		relievers: [],
		hitters: [],
		startingPitchers: [],
	});
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

				// Fetch existing roster
				const [relieversRoster, hittersRoster, startingPitchersRoster] =
					await Promise.all([
						axios.get("http://localhost:8080/api/roster/relievers"),
						axios.get("http://localhost:8080/api/roster/hitters"),
						axios.get("http://localhost:8080/api/roster/startingPitchers"),
					]);

				setExistingRoster({
					relievers: relieversRoster.data,
					hitters: hittersRoster.data,
					startingPitchers: startingPitchersRoster.data,
				});

				// Update roster counts
				setRosterCounts({
					relievers: relieversRoster.data.length,
					hitters: hittersRoster.data.length,
					startingPitchers: startingPitchersRoster.data.length,
				});
			} catch (error) {
				setError("Error fetching data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const isDuplicate = (player, category) => {
		return existingRoster[category].some(
			(existingPlayer) => existingPlayer.id === player.id
		);
	};

	const handleAddToRoster = async (player, category) => {
		// Combine counts from all categories to check against the 26-player limit
		const totalRosterCount = Object.values(rosterCounts).reduce(
			(a, b) => a + b,
			0
		);

		if (totalRosterCount >= 26) {
			alert("Cannot add more players. Roster is full.");
			return;
		}
		if (isDuplicate(player, category)) {
			alert("Player is already in the roster.");
			return;
		}

		try {
			await axios.post(`http://localhost:8080/api/roster/${category}`, player);
			alert(`Added to ${category} roster!`);

			// Update roster counts
			setRosterCounts((prev) => ({ ...prev, [category]: prev[category] + 1 }));
			// Update existing roster data
			setExistingRoster((prev) => ({
				...prev,
				[category]: [...prev[category], player],
			}));
		} catch (error) {
			setError(`Error adding to ${category} roster`);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className={styles.container}>
			<h1>View Top Players</h1>

			<section className={styles.category}>
				<div>
					<h2>Relievers</h2>
				</div>
				<div className={styles.cardContainer}>
					{relievers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								handleAdd={() => handleAddToRoster(player, "relievers")}
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
								handleAdd={() => handleAddToRoster(player, "hitters")}
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
								handleAdd={() => handleAddToRoster(player, "startingPitchers")}
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
