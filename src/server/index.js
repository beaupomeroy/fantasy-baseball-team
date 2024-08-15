require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const {
	getTopRelievers,
	getTopHitters,
	getTopStartingPitchers,
} = require("./controller");

const app = express();
app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection

let usersCollection; // Add a reference to the users collection

const { MongoClient, ServerApiVersion } = require("mongodb");
const {
	relieverSchema,
	hitterSchema,
	startingPitcherSchema,
} = require("./schemas");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

app.use(
	session({
		secret: process.env.SESSION_SECRET || "your_secret_key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production", // Only set to true if using HTTPS
			httpOnly: true, // Helps mitigate XSS attacks
			maxAge: 24 * 60 * 60 * 1000, // Session expiration (e.g., 1 day)
		},
	})
);
function ensureAuthenticated(req, res, next) {
	if (req.session && req.session.user) {
		// User is authenticated
		return res.redirect("/");
	} else {
		// User is not authenticated
		res.status(401).json({ error: "Unauthorized" });
	}
}

async function createValidation() {
	try {
		const db = client.db("myDatabase");

		await Promise.all([
			db.command({
				collMod: "relieverRoster",
				validator: relieverSchema,
				validationAction: "error", // Enforce schema validation
			}),
			db.command({
				collMod: "hitterRoster",
				validator: hitterSchema,
				validationAction: "error", // Enforce schema validation
			}),
			db.command({
				collMod: "startingPitchersRoster",
				validator: startingPitcherSchema,
				validationAction: "error", // Enforce schema validation
			}),
		]);

		console.log("Schema validation set.");
	} catch (error) {
		console.error("Error setting schema validation", error);
	}
}

createValidation();

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

		// Assign the usersCollection reference
		usersCollection = database.collection("users");

		// Other collections
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

app.post("/api/roster/relievers", async (req, res) => {
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
		res.status(200).json(insertOneRelieverResult);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.post("/api/roster/startingPitchers", async (req, res) => {
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
		// Get current lineup counts
		const [hitters, relievers, startingPitchers] = await Promise.all([
			hittersStartingLineup.find().toArray(),
			relieversStartingLineup.find().toArray(),
			startingPitchersStartingLineup.find().toArray(),
		]);

		const outfieldersCount = hitters.filter(
			(player) => player.position === "OF"
		).length;

		// Count each non-outfielder position
		const positionsCount = {};
		hitters.forEach((player) => {
			if (player.position !== "OF") {
				positionsCount[player.position] =
					(positionsCount[player.position] || 0) + 1;
			}
		});

		if (position === "SP") {
			if (startingPitchers.length >= 1) {
				return res
					.status(400)
					.json({ error: "Cannot add more than 1 starting pitcher." });
			}

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
			if (relievers.length >= 4) {
				return res
					.status(400)
					.json({ error: "Cannot add more than 4 relievers." });
			}

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
			if (position === "OF" && outfieldersCount >= 3) {
				return res
					.status(400)
					.json({ error: "Cannot add more than 3 outfielders." });
			} else if (position !== "OF" && (positionsCount[position] || 0) >= 1) {
				return res.status(400).json({
					error: `Cannot add more than 1 player for position ${position}.`,
				});
			}

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

app.post(
	"/api/register",
	[
		body("email").isEmail().withMessage("Please enter a valid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long"),
		body("name").notEmpty().withMessage("Name is required"),
	],
	async (req, res) => {
		console.log("Register request received:", req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password, name } = req.body;

		try {
			const existingUser = await usersCollection.findOne({ email });
			if (existingUser) {
				return res
					.status(400)
					.json({ error: "A user with this email already exists." });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = {
				email,
				password: hashedPassword,
				name,
				createdAt: new Date(),
			};

			const result = await usersCollection.insertOne(newUser);

			res.status(201).json({
				user: {
					_id: result.insertedId,
					email: newUser.email,
					name: newUser.name,
				},
			});
		} catch (error) {
			console.error("Error registering user", error);
			res.status(500).send("Server error");
		}
	}
);

app.post("/api/signin", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await usersCollection.findOne({ email });

		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Store user info in session
		req.session.user = {
			_id: user._id,
			email: user.email,
			name: user.name,
		};

		res.status(200).json({
			message: "Sign-in successful",
			user: {
				_id: user._id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (err) {
		console.error("Error signing in", err);
		res.status(500).send("Server error");
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

app.get("/api/roster/count", async (req, res) => {
	try {
		const [relieversCount, hittersCount, startingPitchersCount] =
			await Promise.all([
				relieverRoster.countDocuments({}),
				hitterRoster.countDocuments({}),
				startingPitchersRoster.countDocuments({}),
			]);

		const total = relieversCount + hittersCount + startingPitchersCount;
		res.json({ count: total });
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.delete("/api/cards/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Promise.all([
			relieverRoster.deleteOne({ _id: new ObjectId(id) }),
			hitterRoster.deleteOne({ _id: new ObjectId(id) }),
			startingPitchersRoster.deleteOne({ _id: new ObjectId(id) }),
		]);

		const deleted = result.some((res) => res.deletedCount === 1);

		if (deleted) {
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
		const objectId = new ObjectId(_id);
		let result;

		if (category === "SP") {
			result = await startingPitchersRoster.deleteOne({ _id: objectId });
		} else if (category === "RP") {
			result = await relieverRoster.deleteOne({ _id: objectId });
		} else {
			result = await hitterRoster.deleteOne({ _id: objectId });
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
		const objectId = new ObjectId(_id);
		let result;

		if (category === "SP") {
			result = await startingPitchersStartingLineup.deleteOne({
				_id: objectId,
			});
		} else if (category === "RP") {
			result = await relieversStartingLineup.deleteOne({ _id: objectId });
		} else {
			result = await hittersStartingLineup.deleteOne({ _id: objectId });
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
app.listen(process.env.PORT || 8080, () => {
	console.log(`Server running on port ${process.env.PORT || 8080}`);
});
