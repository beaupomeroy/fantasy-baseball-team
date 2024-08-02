const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
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

let relieverCollection;
let hitterCollection;
let startingPitchersCollection;

async function connectToDatabase() {
	try {
		await client.connect();
		const dbName = "myDatabase";
		const database = client.db(dbName);
		relieverCollection = database.collection("relieverCollection");
		hitterCollection = database.collection("hitterCollection");
		startingPitchersCollection = database.collection(
			"startingPitchersCollection"
		);
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

app.post("/api/collection/relievers", async (req, res) => {
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
		const insertOneRelieverResult = await relieverCollection.insertOne(
			newRelieverCard
		);
		console.log("insertOneRelieverResult", insertOneRelieverResult);
		res.status(200).json(insertOneRelieverResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.post("/api/collection/startingPitchers", async (req, res) => {
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
			await startingPitchersCollection.insertOne(newStartingPitchersCard);
		console.log(
			"insertOneStartingPitchersResult",
			insertOneStartingPitchersResult
		);
		res.status(200).json(insertOneStartingPitchersResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.post("/api/collection/hitters", async (req, res) => {
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
		const insertOneHitterResult = await hitterCollection.insertOne(
			newHitterCard
		);
		res.status(200).json(insertOneHitterResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/collection/relievers", async (req, res) => {
	try {
		const collection = await relieverCollection.find().toArray();
		res.json(collection);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/collection/hitters", async (req, res) => {
	try {
		const collection = await hitterCollection.find().toArray();
		res.json(collection);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.get("/api/collection/startingPitchers", async (req, res) => {
	try {
		const collection = await startingPitchersCollection.find().toArray();
		res.json(collection);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.delete("/api/cards/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await collection.deleteOne({
			_id: new MongoClient.ObjectId(id),
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

app.get("/api/top-relievers", getTopRelievers);
app.get("/api/top-hitters", getTopHitters);
app.get("/api/top-starting-pitchers", getTopStartingPitchers);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
