import React from "react";
import { Typography, Container, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./HomeScreen.module.css";

function HomeScreen() {
	return (
		<div className={styles.root}>
			{/* Welcome Text */}
			<div className={styles.welcomeText}>
				<Container>
					<Typography variant="h3" gutterBottom>
						Welcome to Fantasy Baseball Dream Team
					</Typography>
					<Typography variant="h6" gutterBottom>
						Step into a clutter-free baseball card collection, where your
						favorite players are just a click away!
					</Typography>

					<Grid container spacing={4} className={styles.features}>
						<Grid item xs={12} sm={6} md={4}>
							<Link to="/player" className={styles.cardLink}>
								<Card className={styles.card}>
									<CardContent>
										<Typography variant="h5">View Top Players</Typography>
										<Typography variant="body2">
											Discover top performers in the league.
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Link to="/roster" className={styles.cardLink}>
								<Card className={styles.card}>
									<CardContent>
										<Typography variant="h5">Manage Your Roster</Typography>
										<Typography variant="body2">
											Keep track of all your favorite players in one place.
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Link to="/starting-lineup" className={styles.cardLink}>
								<Card className={styles.card}>
									<CardContent>
										<Typography variant="h5">Create Fantasy Team</Typography>
										<Typography variant="body2">
											Build your dream team
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
					</Grid>
				</Container>
			</div>
		</div>
	);
}

export default HomeScreen;
