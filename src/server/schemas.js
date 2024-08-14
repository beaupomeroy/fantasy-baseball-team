// schemas.js
const relieverSchema = {
	$jsonSchema: {
		bsonType: "object",
		required: ["id", "name", "position"],
		properties: {
			id: {
				bsonType: "string",
				description: "must be a string and is required",
			},
			name: {
				bsonType: "string",
				description: "must be a string and is required",
			},
			position: {
				bsonType: "string",
				enum: ["RP"], // Relievers only
				description: "must be one of the allowed positions",
			},
			era: {
				bsonType: "number",
				description: "must be a number and is required",
			},
			saves: {
				bsonType: "number",
				description: "must be a number and is required",
			},
			strikeouts: {
				bsonType: "number",
				description: "must be a number and is required",
			},
			imageUrl: {
				bsonType: "string",
				description: "must be a string",
			},
		},
	},
};

const hitterSchema = {
	$jsonSchema: {
		bsonType: "object",
		required: ["id", "name", "position"],
		properties: {
			id: {
				bsonType: "string",
				description: "must be a string and is required",
			},
			name: {
				bsonType: "string",
				description: "must be a string and is required",
			},
			position: {
				bsonType: "string",
				enum: ["OF", "1B", "2B", "3B", "SS", "C", "DH"], // List all valid positions
				description: "must be one of the allowed positions",
			},
			battingAvg: {
				bsonType: "number",
				description: "must be a number",
			},
			homeRuns: {
				bsonType: "number",
				description: "must be a number",
			},
			RBIs: {
				bsonType: "number",
				description: "must be a number",
			},
			imageUrl: {
				bsonType: "string",
				description: "must be a string",
			},
		},
	},
};

const startingPitcherSchema = {
	$jsonSchema: {
		bsonType: "object",
		required: ["id", "name", "position"],
		properties: {
			id: {
				bsonType: "string",
				description: "must be a string and is required",
			},
			name: {
				bsonType: "string",
				description: "must be a string and is required",
			},
			position: {
				bsonType: "string",
				enum: ["SP"], // Starting Pitchers only
				description: "must be one of the allowed positions",
			},
			era: {
				bsonType: "number",
				description: "must be a number and is required",
			},
			wins: {
				bsonType: "number",
				description: "must be a number and is required",
			},
			strikeouts: {
				bsonType: "number",
				description: "must be a number and is required",
			},
			imageUrl: {
				bsonType: "string",
				description: "must be a string",
			},
		},
	},
};

module.exports = {
	relieverSchema,
	hitterSchema,
	startingPitcherSchema,
};
