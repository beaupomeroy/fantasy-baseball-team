const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const {
	getTopRelievers,
	getTopHitters,
	getTopStartingPitchers,
} = require("./controller");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const dbURI =
	"mongodb+srv://beaupomeroy:pqQyt4o58VSsYATG@cluster0.6qnjlqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(dbURI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let relieverRoster;
let hitterRoster;
let startingPitchersRoster;
let startingPitchersStartingLineup;
let relieversStartingLineup;
let hittersStartingLineup;

async function connectToDatabase() {
	try {
		await client.connect();
		const dbName = "myDatabase";
		const database = client.db(dbName);
		relieverRoster = database.collection("relieverRoster");
		hitterRoster = database.collection("hitterRoster");
		startingPitchersRoster = database.collection("startingPitchersRoster");
		startingPitchersStartingLineup = database.collection(
			"startingPitchersStartingLineup"
		);
		relieversStartingLineup = database.collection("relieversStartingLineup");
		hittersStartingLineup = database.collection("hittersStartingLineup");
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} catch (error) {
		console.error("Error connecting to MongoDB", error);
	}
}

connectToDatabase();

// Endpoints
// app.get("/api/relieverCards", async (req, res) => {
// 	try {
// 		const relieverCards = await relieverCollection.find().toArray();
// 		res.json(relieverCards);
// 	} catch (err) {
// 		res.status(500).send(err.message);
// 	}
// });

// app.post("/api/relieverCards", async (req, res) => {
// 	const { name, position, imageUrl, id, era, saves, strikeouts } = req.body;
// 	const newRelieverCard = {
// 		id,
// 		era,
// 		saves,
// 		strikeouts,
// 		name,
// 		position,
// 		imageUrl,
// 	};
// 	try {
// 		const result = await relieverCollection.insertOne(newRelieverCard);
// 		res.status(200).json(insertOneRelieverResult);
// 	} catch (err) {
// 		res.status(500).send(err.message);
// 	}
// });

app.post("/api/roster/relievers", async (req, res) => {
	console.log("BODY", req.body);
	const { name, position, imageUrl, id, era, saves, strikeouts } = req.body;

	const newRelieverCard = {
		id,
		era,
		saves,
		strikeouts,
		name,
		position,
		imageUrl,
	};

	try {
		const insertOneRelieverResult = await relieverRoster.insertOne(
			newRelieverCard
		);
		console.log("insertOneRelieverResult", insertOneRelieverResult);
		res.status(200).json(insertOneRelieverResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.post("/api/roster/startingPitchers", async (req, res) => {
	console.log("BODY", req.body);
	const { name, position, imageUrl, id, era, wins, strikeouts } = req.body;

	const newStartingPitchersCard = {
		id,
		era,
		wins,
		strikeouts,
		name,
		position,
		imageUrl,
	};

	try {
		const insertOneStartingPitchersResult =
			await startingPitchersRoster.insertOne(newStartingPitchersCard);
		console.log(
			"insertOneStartingPitchersResult",
			insertOneStartingPitchersResult
		);
		res.status(200).json(insertOneStartingPitchersResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.post("/api/roster/hitters", async (req, res) => {
	const { name, position, battingAvg, homeRuns, id, RBIs, imageUrl } = req.body;

	const newHitterCard = {
		id,
		battingAvg,
		homeRuns,
		RBIs,
		name,
		position,
		imageUrl,
	};

	try {
		const insertOneHitterResult = await hitterRoster.insertOne(newHitterCard);
		res.status(200).json(insertOneHitterResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.post("/api/starting-lineup", async (req, res) => {
	const {
		name,
		position,
		battingAvg,
		homeRuns,
		id,
		RBIs,
		era,
		wins,
		saves,
		strikeouts,
		imageUrl,
	} = req.body;

	try {
		if (position === "SP") {
			const newStartingPitcherStartingLineupCard = {
				id,
				name,
				position,
				era,
				wins,
				strikeouts,
				imageUrl,
			};
			const insertOneStartingPitcherStartingLineupResult =
				await startingPitchersStartingLineup.insertOne(
					newStartingPitcherStartingLineupCard
				);
			res.status(200).json(insertOneStartingPitcherStartingLineupResult);
		} else if (position === "RP") {
			const newRelieverStartingLineupCard = {
				id,
				name,
				position,
				era,
				saves,
				strikeouts,
				imageUrl,
			};
			const insertOneRelieverStartingLineupResult =
				await relieversStartingLineup.insertOne(newRelieverStartingLineupCard);
			res.status(200).json(insertOneRelieverStartingLineupResult);
		} else {
			// Assuming any other position is a hitter
			const newHitterStartingLineupCard = {
				id,
				name,
				position,
				battingAvg,
				homeRuns,
				RBIs,
				imageUrl,
			};
			const insertOneHitterStartingLineupResult =
				await hittersStartingLineup.insertOne(newHitterStartingLineupCard);
			res.status(200).json(insertOneHitterStartingLineupResult);
		}
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/roster/relievers", async (req, res) => {
	try {
		const roster = await relieverRoster.find().toArray();
		res.json(roster);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/roster/hitters", async (req, res) => {
	try {
		const roster = await hitterRoster.find().toArray();
		res.json(roster);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/roster/startingPitchers", async (req, res) => {
	try {
		const roster = await startingPitchersRoster.find().toArray();
		res.json(roster);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/starting-lineup", async (req, res) => {
	try {
		const [hitters, relievers, startingPitchers] = await Promise.all([
			hittersStartingLineup.find().toArray(),
			relieversStartingLineup.find().toArray(),
			startingPitchersStartingLineup.find().toArray(),
		]);
		const startingLineup = { hitters, relievers, startingPitchers };
		res.json(startingLineup);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.delete("/api/cards/:id", async (req, res) => {
	try {
		const { _id } = req.params;
		const result = await collection.deleteOne({
			_id: new MongoClient.ObjectId(_id),
		});
		if (result.deletedCount === 1) {
			res.json({ success: true });
		} else {
			res.status(404).json({ success: false, message: "Card not found" });
		}
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.delete("/api/roster/:_id", async (req, res) => {
	try {
		const { _id } = req.params;
		const { category } = req.body;
		let objectId = new ObjectId(_id);
		console.log("new objectid", objectId);
		let result;

		if (category === "SP") {
			result = await startingPitchersRoster.deleteOne({
				_id: objectId,
			});
		} else if (category === "RP") {
			result = await relieverRoster.deleteOne({
				_id: objectId,
			});
		} else {
			result = await hitterRoster.deleteOne({
				_id: objectId,
			});
		}

		if (result.deletedCount === 1) {
			res.json({ success: true });
		} else {
			res.status(404).json({ success: false, message: "Player not found" });
		}
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.delete("/api/starting-lineup/:_id", async (req, res) => {
	try {
		const { _id } = req.params;
		const { category } = req.body;
		let objectId = new ObjectId(_id);
		console.log("new objectid", objectId);
		let result;

		if (category === "SP") {
			result = await startingPitchersStartingLineup.deleteOne({
				_id: objectId,
			});
		} else if (category === "RP") {
			result = await relieversStartingLineup.deleteOne({
				_id: objectId,
			});
		} else {
			result = await hittersStartingLineup.deleteOne({
				_id: objectId,
			});
		}

		if (result.deletedCount === 1) {
			res.json({ success: true });
		} else {
			res.status(404).json({ success: false, message: "Player not found" });
		}
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/top-relievers", getTopRelievers);
app.get("/api/top-hitters", getTopHitters);
app.get("/api/top-starting-pitchers", getTopStartingPitchers);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
