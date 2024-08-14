import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"; // Import the CSS file
import HomeScreen from "./components/homeComponent/HomeScreen";
import Header from "./components/Header"; // Import the Header component
import Footer from "./components/Footer"; // Import the Footer component
import Player from "./components/playerComponent/Player";
import Roster from "./components/rosterComponent/Roster";
import StartingLineup from "./components/StartingLineup/StartingLineup";
import SignIn from "./components/Auth/SignIn";
import Register from "./components/Auth/Register";
import {
	RosterHittersContext,
	RosterStartingPitchersContext,
	RosterRelieversContext,
	LineupHittersContext,
	LineupStartingPitchersContext,
	LineupRelieversContext,
} from "./Context";

function App() {
	const [rosterHitters, setRosterHitters] = useState([]);
	const [rosterStartingPitchers, setRosterStartingPitchers] = useState([]);
	const [rosterRelievers, setRosterRelievers] = useState([]);

	const [lineupHitters, setLineupHitters] = useState([]);
	const [lineupStartingPitchers, setLineupStartingPitchers] = useState([]);
	const [lineupRelievers, setLineupRelievers] = useState([]);

	return (
		<RosterHittersContext.Provider value={{ rosterHitters, setRosterHitters }}>
			<RosterStartingPitchersContext.Provider
				value={{ rosterStartingPitchers, setRosterStartingPitchers }}
			>
				<RosterRelieversContext.Provider
					value={{ rosterRelievers, setRosterRelievers }}
				>
					<LineupHittersContext.Provider
						value={{ lineupHitters, setLineupHitters }}
					>
						<LineupStartingPitchersContext.Provider
							value={{ lineupStartingPitchers, setLineupStartingPitchers }}
						>
							<LineupRelieversContext.Provider
								value={{ lineupRelievers, setLineupRelievers }}
							>
								<Router>
									<div className="App">
										<Header /> {/* Use the Header component */}
										<div style={{ paddingTop: "60px" }}>
											<Routes>
												<Route path="/" element={<HomeScreen />} />
												<Route path="/player" element={<Player />} />

												<Route path="/roster" element={<Roster />} />

												<Route
													path="/starting-lineup"
													element={<StartingLineup />}
												/>
												<Route path="/signin" element={<SignIn />} />
												<Route path="/register" element={<Register />} />
											</Routes>
										</div>
										<Footer /> {/* Use the Footer component */}
									</div>
								</Router>
							</LineupRelieversContext.Provider>
						</LineupStartingPitchersContext.Provider>
					</LineupHittersContext.Provider>
				</RosterRelieversContext.Provider>
			</RosterStartingPitchersContext.Provider>
		</RosterHittersContext.Provider>
	);
}

export default App;
