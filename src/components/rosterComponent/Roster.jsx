import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./Roster.module.css";
import { useLocation } from "react-router-dom";
import FlippableCard from "../FlippableCardComponent/FlippableCard";
import {
    RosterHittersContext,
    RosterStartingPitchersContext,
    RosterRelieversContext,
} from "../../Context";

const Roster = () => {
    let location = useLocation();
    const { rosterHitters, setRosterHitters } = useContext(RosterHittersContext);
    const { rosterStartingPitchers, setRosterStartingPitchers } = useContext(
        RosterStartingPitchersContext
    );
    const { rosterRelievers, setRosterRelievers } = useContext(
        RosterRelieversContext
    );
    const [error, setError] = useState("");

    useEffect(() => {
        // Reset collection data when the component mounts
        setRosterHitters([]);
        setRosterRelievers([]);
        setRosterStartingPitchers([]);

        const fetchRoster = async () => {
            console.log("FETCH CALL");
            try {
                // Fetch all data in parallel
                const [hittersResponse, relieversResponse, startingPitchersResponse] =
                    await Promise.all([
                        axios.get("http://localhost:8080/api/roster/hitters"),
                        axios.get("http://localhost:8080/api/roster/relievers"),
                        axios.get("http://localhost:8080/api/roster/startingPitchers"),
                    ]);

                // Log the response data
                console.log("HITTERS DATA", hittersResponse.data);
                console.log("RELIEVERS DATA", relieversResponse.data);
                console.log("STARTING PITCHERS DATA", startingPitchersResponse.data);

                // Set the state with the response data
                setRosterHitters(hittersResponse.data || []);
                setRosterRelievers(relieversResponse.data || []);
                setRosterStartingPitchers(startingPitchersResponse.data || []);
            } catch (error) {
                console.log("ERROR", error);
                setError("Error fetching roster");
            }
        };

        fetchRoster();
    }, [setRosterHitters, setRosterRelievers, setRosterStartingPitchers]);

    const handleAddToStartingLineup = async (player) => {
        try {
            console.log("PLAYER", player);
            const response = await axios.post(
                "http://localhost:8080/api/starting-lineup",
                player
            );

            if (response.status === 200) {
                alert("Added to starting lineup!");
            } else {
                alert(
                    `Error: ${response.data.error || "An unexpected error occurred"}`
                );
            }
        } catch (error) {
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    if (error) return <div>{error}</div>;

    const handleDeleteFromRoster = async (player) => {
        console.log("Attempting to delete player:", player);
        try {
            const response = await axios.delete(
                `http://localhost:8080/api/roster/${player._id}`,
                {
                    data: { category: player.position },
                }
            );
            console.log("Delete response:", response.data);
            if (response.data.success) {
                if (player.position === "SP") {
                    setRosterStartingPitchers((prev) =>
                        prev.filter((p) => p._id !== player._id)
                    );
                } else if (player.position === "RP") {
                    setRosterRelievers((prev) =>
                        prev.filter((p) => p._id !== player._id)
                    );
                } else {
                    setRosterHitters((prev) => prev.filter((p) => p._id !== player._id));
                }
            } else {
                setError("Player not found");
            }
        } catch (error) {
            console.error("Error removing player:", error);
            setError("Error removing player from Roster");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Roster</h1>

            <section className={styles.category}>
                <h2>Relievers</h2>
                <div className={styles.cardContainer}>
                    {rosterRelievers &&
                        rosterRelievers.map((player) => (
                            <div key={player._id || player.name} className="">
                                <FlippableCard
                                    player={player}
                                    handleAdd={handleAddToStartingLineup}
                                    handleRemove={handleDeleteFromRoster}
                                    location={location.pathname}
                                />
                            </div>
                        ))}
                </div>
            </section>

            <section className={styles.category}>
                <h2>Hitters</h2>
                <div className={styles.cardContainer}>
                    {rosterHitters &&
                        rosterHitters.map((player) => (
                            <div key={player._id || player.name} className="">
                                <FlippableCard
                                    player={player}
                                    handleAdd={handleAddToStartingLineup}
                                    handleRemove={handleDeleteFromRoster}
                                    location={location.pathname}
                                />
                            </div>
                        ))}
                </div>
            </section>

            <section className={styles.category}>
                <h2>Starting Pitchers</h2>
                <div className={styles.cardContainer}>
                    {rosterStartingPitchers &&
                        rosterStartingPitchers.map((player) => (
                            <div key={player._id || player.name} className="">
                                <FlippableCard
                                    player={player}
                                    handleAdd={handleAddToStartingLineup}
                                    handleRemove={handleDeleteFromRoster}
                                    location={location.pathname}
                                />
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
};

export default Roster;
