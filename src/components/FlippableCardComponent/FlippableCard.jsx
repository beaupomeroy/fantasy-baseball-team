import React, { useState, useContext } from "react";
import { Card, CardContent } from "@mui/material";
import styles from "./Flippable.module.css";
import Button from "@mui/material/Button";

const FlippableCard = ({ player, handleAdd, location, handleRemove }) => {
	const [flipped, setFlipped] = useState(false);

	const handleClick = () => {
		setFlipped(!flipped);
	};

	return (
		<div className={styles.cardContainer} onClick={handleClick}>
			<div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
				<Card className={styles.cardFront}>
					<CardContent>
						<img
							src={player.imageUrl || "default-image-url"}
							alt={player.name}
							className={styles.image}
						/>
						<h3>{player.name}</h3>
						<p>Position: {player.position}</p>
						{location === "/player" && (
							<Button
								variant="contained"
								onClick={(e) => {
									e.stopPropagation();
									handleAdd(player);
								}}
							>
								Add to Roster
							</Button>
						)}
						{location === "/roster" && (
							<>
								<Button
									variant="contained"
									color="secondary"
									onClick={(e) => {
										e.stopPropagation();
										handleAdd(player);
									}}
								>
									Add to Starting Lineup
								</Button>
								<Button
									variant="contained"
									color="error"
									onClick={(e) => {
										e.stopPropagation();
										handleRemove(player);
									}}
								>
									Remove from Roster
								</Button>
							</>
						)}
						{location === "/starting-lineup" && (
							<Button
								variant="contained"
								color="error"
								onClick={(e) => {
									e.stopPropagation();
									handleRemove(player);
								}}
							>
								Remove from Lineup
							</Button>
						)}
					</CardContent>
				</Card>
				<Card className={styles.cardBack}>
					<CardContent>
						{player.position === "RP" ? (
							<>
								<p>ERA: {player.era}</p>
								<p>Saves: {player.saves}</p>
								<p>Strikeouts: {player.strikeouts}</p>
							</>
						) : player.position === "SP" ? (
							<>
								<p>ERA: {player.era}</p>
								<p>Wins: {player.wins}</p>
								<p>Strikeouts: {player.strikeouts}</p>
							</>
						) : (
							<>
								<p>Batting Avg: {player.battingAvg}</p>
								<p>Home Runs: {player.homeRuns}</p>
								<p>RBIs: {player.RBIs}</p>
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default FlippableCard;
