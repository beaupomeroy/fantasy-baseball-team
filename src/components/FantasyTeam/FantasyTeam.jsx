import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FantasyTeam.module.css";
import FlippableCard from "../FlippableCardComponent/FlippableCard";
import { useLocation } from "react-router-dom";

const FantasyTeam = () => {
	const [hitters, setHitters] = useState([]);
	const [relievers, setRelievers] = useState([]);
	const [startingPitchers, setStartingPitchers] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	let location = useLocation();

	useEffect(() => {
		const fetchMyFantasyTeam = async () => {
			try {
				const responses = await axios.get(
					"http://localhost:8080/api/myFantasyTeam"
				);
				// Assuming the endpoint returns an object with properties: hitters, relievers, and startingPitchers
				console.log("Responses", responses.data);
				const { hitters, relievers, startingPitchers } = responses.data;
				setHitters(hitters);
				setRelievers(relievers);
				setStartingPitchers(startingPitchers);
				setLoading(false);
			} catch (error) {
				setError("Error fetching Fantasy Team");
				setLoading(false);
			}
		};

		fetchMyFantasyTeam();
	}, []);

	const handleDeleteFromStartingLineup = async (player) => {
		console.log("Attempting to delete player:", player);
		try {
			const response = await axios.delete(
				`http://localhost:8080/api/myFantasyTeam/${player._id}`,
				{
					data: { category: player.position },
				}
			);
			console.log("Delete response:", response.data); // Log response data
			if (response.data.success) {
				// Handle successful removal
				if (player.position === "SP") {
					setStartingPitchers((prev) =>
						prev.filter((p) => p._id !== player._id)
					);
				} else if (player.position === "RP") {
					setRelievers((prev) => prev.filter((p) => p._id !== player._id));
				} else {
					setHitters((prev) => prev.filter((p) => p._id !== player._id));
				}
			} else {
				setError("Player not found");
			}
		} catch (error) {
			console.error("Error removing player:", error); // Log error details
			setError("Error removing player from Fantasy Team");
		}
	};

	console.log("HITTERS", hitters);

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

	const groupedHitters = groupHittersByPosition(hitters);

	return (
		<div className={styles.container}>
			<h1>Beau's Fantasy Lineup</h1>

			<section className={styles.category}>
				<h2>Starting Pitcher</h2>
				<div className={styles.cardContainer}>
					{startingPitchers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard player={player} location={location.pathname} />
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteFromStartingLineup(player);
								}}
							>
								Remove
							</button>
						</div>
					))}
				</div>
			</section>

			<section className={styles.category}>
				<h2>Relievers</h2>
				<div className={styles.cardContainer}>
					{relievers.map((player) => (
						<div key={player._id || player.name} className="">
							<FlippableCard
								player={player}
								handleRemove={handleDeleteFromStartingLineup}
								location={location.pathname}
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
										handleRemove={handleDeleteFromStartingLineup}
										location={location.pathname}
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
