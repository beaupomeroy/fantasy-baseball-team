import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./FantasyTeam.module.css";
import FlippableCard from "../FlippableCardComponent/FlippableCard";
import { useLocation } from "react-router-dom";
import {
	LineupHittersContext,
	LineupStartingPitchersContext,
	LineupRelieversContext,
} from "../../Context";

const FantasyTeam = () => {
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
		const fetchMyFantasyTeam = async () => {
			try {
				const responses = await axios.get(
					"http://localhost:8080/api/myFantasyTeam"
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

		fetchMyFantasyTeam();
	}, [setLineupHitters, setLineupRelievers, setLineupStartingPitchers]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	const groupHittersByPosition = (hitters) => {
		if (!Array.isArray(hitters)) return {};
		return hitters.reduce((acc, hitter) => {
			const position = hitter.position || "Unknown";
			if (!acc[position]) acc[position] = [];
			acc[position].push(hitter);
			return acc;
		}, {});
	};

	const groupedHitters = groupHittersByPosition(lineupHitters);

	const handleDeleteFromStartingLineup = async (player) => {
		console.log("Attempting to delete player:", player);
		try {
			const response = await axios.delete(
				`http://localhost:8080/api/myFantasyTeam/${player._id}`,
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
				{Object.keys(groupedHitters).map((position) => (
					<div key={position} className={styles.positionGroup}>
						<h3>{position}</h3>
						<div className={styles.cardContainer}>
							{groupedHitters[position].map((player) => (
								<div key={player._id || player.name} className="">
									<FlippableCard
										player={player}
										location={location.pathname}
										handleRemove={handleDeleteFromStartingLineup}
									/>
								</div>
							))}
						</div>
					</div>
				))}
			</section>
		</div>
	);
};

export default FantasyTeam;
