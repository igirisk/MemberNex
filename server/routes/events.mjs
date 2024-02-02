import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import verifyToken from "./verifyToken.mjs";

const router = express.Router();

const successResponse = (message, data = null) => {
	return { success: true, message, data };
};

const errorResponse = (message, details = null) => {
	return { success: false, error: message, details };
};

// Funtion to set first character in string to uppercase
function firstUpperCase(str) {
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

// #region validation
// Function to check if fields are empty
function areFieldsEmpty(event) {
	for (let key in event) {
		if (
			event.hasOwnProperty(key) &&
			(event[key] === undefined || event[key] === null || event[key] === "")
		) {
			return true; // Field is empty
		}
	}
	return false; // No empty fields found
}

function isValidDate(date) {
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/; //date format (YYYY-MM-DD)
	if (!dateRegex.test(date)) {
		return false;
	}
	// Parse the input as a Date object and check if it's a valid date
	const parsedDate = new Date(date);
	return !isNaN(parsedDate.getTime());
}

function isValidTime(time) {
	const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; //time format (HH:MM)
	// Check if the input matches the time format
	if (!timeRegex.test(time)) {
		return false;
	}
	// Split the time components and check their validity
	const [hours, minutes] = time.split(":");

	// Check if hours and minutes are within valid ranges
	if (
		parseInt(hours, 10) < 0 ||
		parseInt(hours, 10) > 23 ||
		parseInt(minutes, 10) < 0 ||
		parseInt(minutes, 10) > 59
	) {
		return false;
	}

	return true;
}

function isValidDescription(description) {
	// Define minimum and maximum character limits
	const minLength = 50;
	const maxLength = 600;

	// Check if the description length is within the specified range
	if (description.length < minLength || description.length > maxLength) {
		return false;
	}

	return true;
}

function isValidCoverImage(cover_image) {
	// Regular expression to check if the string is a valid base64-encoded image
	const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;

	return base64Regex.test(cover_image);
}
// #endregion

// Connect to the MongoDB database and create a unique index on the "admin_number" field
const initDatabase = async () => {
	const collection = await db.collection("events");

	// Create a unique index on the "admin_number" field
	await collection.createIndex({ name: 1 }, { unique: true });

	console.log(`events MongoDB connected and index created.`);
};

// call the function to initislie the database
initDatabase();

// get list of all events info
router.get("/", verifyToken, async (req, res) => {
	try {
		const collection = await db.collection("events");
		let result = await collection.find({}).toArray();

		if (result.length !== 0) {
			return res.status(200).send(successResponse("events retrieved", result));
		} else {
			return res
				.status(200)
				.send(successResponse("There is currently no events", result));
		}
	} catch (e) {
		console.error("Error fetching all events info:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// get event info by id
router.get("/:id", verifyToken, async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("events");
		let result = await collection.findOne(query);

		if (result) {
			return res.status(200).send(successResponse("event retrieved", result));
		} else {
			return res.status(404).send(errorResponse("event not found"));
		}
	} catch (e) {
		console.error("Error fetching event by ID:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// create new event
router.post("/", verifyToken, async (req, res) => {
	try {
		const newevent = {
			name: req.body.name,
			date: req.body.date,
			start_time: req.body.start_time,
			end_time: req.body.end_time,
			description: req.body.description,
			location: req.body.location,
			cover_image: req.body.cover_image,
		};

		if (areFieldsEmpty(newevent)) {
			return res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else if (!isValidDate(newevent.date)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid date(YYYY-MM-DD)."));
		} else if (!isValidTime(newevent.start_time)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid start time(HH:MM)."));
		} else if (!isValidTime(newevent.end_time)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid end time(HH:MM)."));
		} else if (!isValidDescription(newevent.description)) {
			return res
				.status(400)
				.send(
					errorResponse("Please input a valid description(50-600 chatacters).")
				);
		} else if (!isValidCoverImage(newevent.cover_image)) {
			return res
				.status(400)
				.send(
					errorResponse("Please upload a valid image file(jpg, jpeg or png)")
				);
		} else {
			// formatting values
			newevent.name = firstUpperCase(newevent.name);

			const collection = await db.collection("events");
			let result = await collection.insertOne(newevent);

			return res.status(200).send(successResponse("event created", result));
		}
	} catch (e) {
		if (e.code === 11000) {
			console.error("Event name already registered.", e);
			return res
				.status(500)
				.send(errorResponse("Event name already registered, try another."));
		} else {
			console.error("Error creating new event:", e);
			return res.status(500).send(errorResponse("Internal Server Error", e));
		}
	}
});

// update event info by id
router.patch("/:id", verifyToken, async (req, res) => {
	try {
		const updates = {
			$set: {
				name: req.body.name,
				date: req.body.date,
				start_time: req.body.start_time,
				end_time: req.body.end_time,
				description: req.body.description,
				location: req.body.location,
				cover_image: req.body.cover_image,
			},
		};
		for (let key in updates.$set) {
			if (
				updates.$set.hasOwnProperty(key) &&
				(updates.$set[key] === undefined ||
					updates.$set[key] === null ||
					updates.$set[key] === "")
			) {
				delete updates.$set[key];
			}
		}

		// add form fields vaildation
		if (Object.keys(updates.$set).length === 0) {
			return res
				.status(400)
				.send(errorResponse("Please fill in input fields to update."));
		}
		if (
			updates.$set.hasOwnProperty("date") &&
			!isValidDate(updates.$set.date)
		) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid date(YYYY-MM-DD)."));
		} else if (
			updates.$set.hasOwnProperty("start_time") &&
			!isValidTime(updates.$set.start_time)
		) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid start time(HH:MM)."));
		} else if (
			updates.$set.hasOwnProperty("end_time") &&
			!isValidTime(updates.$set.end_time)
		) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid end time(HH:MM)."));
		} else if (
			updates.$set.hasOwnProperty("description") &&
			!isValidDescription(updates.$set.description)
		) {
			return res
				.status(400)
				.send(
					errorResponse("Please input a valid description(50-600 chatacters).")
				);
		} else if (
			updates.$set.hasOwnProperty("cover_image") &&
			!isValidCoverImage(updates.$set.cover_image)
		) {
			return res
				.status(400)
				.send(
					errorResponse("Please upload a valid image file(jpg, jpeg or png)")
				);
		} else if (
			updates.$set.hasOwnProperty("role") &&
			!isValidRole(updates.$set.role)
		) {
			return res.status(400).send(errorResponse("Please input a vaild role"));
		} else {
			// formatting values
			const keysToCheck = [
				"first_name",
				"last_name",
				"email",
				"activeness",
				"role",
			];

			keysToCheck.forEach((key) => {
				if (updates.$set.hasOwnProperty(key)) {
					// Check the key and perform the corresponding operation
					if (key === "name") {
						updates.$set[key] = firstUpperCase(updates.$set[key]);
					}
				}
			});

			const query = { _id: new ObjectId(req.params.id) };
			const collection = await db.collection("events");
			let result = await collection.updateOne(query, updates);

			if (result.matchedCount === 1) {
				if (result.modifiedCount === 1) {
					res
						.status(200)
						.send(successResponse(`${req.params.id} event is updated`, result));
				} else {
					return res
						.status(200)
						.send(successResponse(`event is up to date`, result));
				}
			} else {
				res
					.status(404)
					.send(
						errorResponse("event not found. Failed to update event", result)
					);
			}
		}
	} catch (e) {
		if (e.code === 11000) {
			console.error("Event name already registered.", e);
			return res
				.status(500)
				.send(errorResponse("Event name already registered, try another."));
		} else {
			console.error("Error updating event info:", e);
			return res.status(500).send(errorResponse("Internal Server Error", e));
		}
	}
});

// delete event by id
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("events");
		let result = await collection.deleteOne(query);

		if (result.deletedCount !== 0) {
			return res.status(200).send(successResponse("event deleted", result));
		} else {
			return res
				.status(404)
				.send(errorResponse("Failed to delete event", result));
		}
	} catch (e) {
		console.error("Error deleting event by ID:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

export default router;
