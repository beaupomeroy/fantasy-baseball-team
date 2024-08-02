import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"; // Import the CSS file
import HomeScreen from "./components/homeComponent/HomeScreen";
import Header from "./components/Header"; // Import the Header component
import Footer from "./components/Footer"; // Import the Footer component
import Player from "./components/playerComponent/Player";
import Collection from "./components/collectionComponent/Collection";

function App() {
	return (
		<Router>
			<div className="App">
				<Header /> {/* Use the Header component */}
				<div style={{ paddingTop: "60px" }}>
					<Routes>
						<Route path="/" element={<HomeScreen />} />
						<Route path="/player" element={<Player />} />
						<Route path="/collection" element={<Collection />} />
					</Routes>
				</div>
				<Footer /> {/* Use the Footer component */}
			</div>
		</Router>
	);
}

export default App;
