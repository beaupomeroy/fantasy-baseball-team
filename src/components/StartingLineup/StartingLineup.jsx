import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./StartingLineup.module.css";
import FlippableCard from "../FlippableCardComponent/FlippableCard";
import { useLocation } from "react-router-dom";
import {
	LineupHittersContext,
	LineupStartingPitchersContext,
	LineupRelieversContext,
} from "../../Context";

const StartingLineup = () => {
	const { lineupHitters, setLineupHitters } = useContext(LineupHittersContext);
	const { lineupStartingPitchers, setLineupStartingPitchers } = useContext(
		LineupStartingPitchersContext
	);
	const { lineupRelievers, setLineupRelievers } = useContext(
		LineupRelieversContext
	);

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	let location = useLocation();

	useEffect(() => {
		const fetchStartingLineup = async () => {
			try {
				const responses = await axios.get(
					"http://localhost:8080/api/starting-lineup"
				);
				const { hitters, relievers, startingPitchers } = responses.data;
				setLineupHitters(hitters);
				setLineupRelievers(relievers);
				setLineupStartingPitchers(startingPitchers);
				setLoading(false);
			} catch (error) {
				setError("Error fetching Fantasy Team");
				setLoading(false);
			}
		};

		fetchStartingLineup();
	}, [setLineupHitters, setLineupRelievers, setLineupStartingPitchers]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	const limitHittersByPosition = (hitters) => {
		const positionLimits = {
			OF: 3, // Limit to 3 outfielders
			C: 1,
			"1B": 1,
			"2B": 1,
			"3B": 1,
			SS: 1,
			DH: 1,
			// Add other positions as needed
		};

		const limitedHitters = [];
		const positionCount = {};

		hitters.forEach((hitter) => {
			const position = hitter.position || "Unknown";
			if (!positionLimits[position]) return; // Ignore positions not in the limit

			if (!positionCount[position]) {
				positionCount[position] = 0;
			}

			if (positionCount[position] < positionLimits[position]) {
				limitedHitters.push(hitter);
				positionCount[position]++;
			}
		});

		return limitedHitters;
	};

	const limitedHitters = limitHittersByPosition(lineupHitters);

	const handleDeleteFromStartingLineup = async (player) => {
		console.log("Attempting to delete player:", player);
		try {
			const response = await axios.delete(
				`http://localhost:8080/api/starting-lineup/${player._id}`,
				{
					data: { category: player.position },
				}
			);
			console.log("Delete response:", response.data);
			if (response.data.success) {
				if (player.position === "SP") {
					setLineupStartingPitchers((prev) =>
						prev.filter((p) => p._id !== player._id)
					);
				} else if (player.position === "RP") {
					setLineupRelievers((prev) =>
						prev.filter((p) => p._id !== player._id)
					);
				} else {
					setLineupHitters((prev) => prev.filter((p) => p._id !== player._id));
				}
			} else {
				setError("Player not found");
			}
		} catch (error) {
			console.error("Error removing player:", error);
			setError("Error removing player from Fantasy Team");
		}
	};

	return (
		<div className={styles.container}>
			<h1>Beau's Fantasy Lineup</h1>

			<section className={styles.category}>
				<h2>Starting Pitcher</h2>
				<div className={styles.cardContainer}>
					{lineupStartingPitchers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								location={location.pathname}
								handleRemove={handleDeleteFromStartingLineup}
							/>
						</div>
					))}
				</div>
			</section>

			<section className={styles.category}>
				<h2>Relievers</h2>
				<div className={styles.cardContainer}>
					{lineupRelievers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								location={location.pathname}
								handleRemove={handleDeleteFromStartingLineup}
							/>
						</div>
					))}
				</div>
			</section>

			<section className={styles.category}>
				<h2>Hitters</h2>
				<div className={styles.cardContainer}>
					{limitedHitters.map((player, index) => (
						<div key={player._id || player.name} className={styles.cardItem}>
							<span className={styles.lineupNumber}>{index + 1}</span>
							<FlippableCard
								player={player}
								location={location.pathname}
								handleRemove={handleDeleteFromStartingLineup}
							/>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default StartingLineup;
