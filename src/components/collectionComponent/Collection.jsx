import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Collection.module.css";
import { useLocation } from "react-router-dom";
import FlippableCard from "../FlippableCardComponent/FlippableCard";
// import styles from "../styles.css";

const Collection = () => {
	let location = useLocation();
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

	const handleAddToFantasyTeam = async (player) => {
		try {
			console.log("PLAYER", player);
			await axios.post("http://localhost:8080/api/myFantasyTeam", player);
			alert("Added to fantasy team!");
		} catch (error) {
			setError("Error adding to fantasy team");
		}
	};

	if (error) return <div>{error}</div>;

	return (
		<div className={styles.container}>
			<h1>Roster</h1>

			<section className={styles.category}>
				<h2>Relievers</h2>
				<div className={styles.cardContainer}>
					{collectionRelievers &&
						collectionRelievers.map((player) => (
							<div key={player._id || player.name} className="">
								<FlippableCard
									player={player}
									handleAdd={handleAddToFantasyTeam}
									location={location.pathname}
								/>
							</div>
						))}
				</div>
			</section>

			<section className={styles.category}>
				<h2>Hitters</h2>
				<div className={styles.cardContainer}>
					{collectionHitters &&
						collectionHitters.map((player) => (
							<div key={player._id || player.name} className="">
								<FlippableCard
									player={player}
									handleAdd={handleAddToFantasyTeam}
									location={location.pathname}
								/>
							</div>
						))}
				</div>
			</section>

			<section className={styles.category}>
				<h2>Starting Pitchers</h2>
				<div className={styles.cardContainer}>
					{collectionStartingPitchers &&
						collectionStartingPitchers.map((player) => (
							<div key={player._id || player.name} className="">
								<FlippableCard
									player={player}
									handleAdd={handleAddToFantasyTeam}
									location={location.pathname}
								/>
							</div>
						))}
				</div>
			</section>
		</div>
	);
};

export default Collection;
