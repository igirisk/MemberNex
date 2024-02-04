import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

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
function areFieldsEmpty(member) {
	for (let key in member) {
		if (
			member.hasOwnProperty(key) &&
			(member[key] === undefined || member[key] === null || member[key] === "")
		) {
			return true; // Field is empty
		}
	}
	return false; // No empty fields found
}

function isValidEmail(email) {
	// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isValidContactNumber(contact_number) {
	const contactNumberRegex = /^\d{8}$/; // 8 digit contact number
	return contactNumberRegex.test(contact_number);
}

function isValidAdminNumber(admin_number) {
	const adminNumberRegex = /^\d{7}[A-Za-z]$/; // 7 digit before a alphabet
	return adminNumberRegex.test(admin_number);
}

function isValidYearOfStudy(study_year) {
	const value = [1, 2, 3];
	return value.includes(study_year);
}

function isValidActiveness(activeness) {
	const value = ["very high", "high", "medium", "low", "very low", "inactive"];
	return value.includes(activeness.toLowerCase());
}

function isValidRole(role) {
	const value = ["main com", "sub com", "member"];
	return value.includes(role.toLowerCase());
}

function isValidProfileImage(profile_image) {
	// Regular expression to check if the string is a valid base64-encoded image
	const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;

	return base64Regex.test(profile_image);
}

const checkAdminNumberExistsInJoinRequests = async (adminNumber) => {
	const collection = await db.collection("joinRequests");

	// Check if admin number exists in the "members" collection
	const existingJoinRequest = await collection.findOne({
		admin_number: adminNumber,
	});

	return !!existingJoinRequest; // Returns true if admin number exists, false otherwise
};
// #endregion

// Connect to the MongoDB database and create a unique index on the "admin_number" field
const initDatabase = async () => {
	const collection = await db.collection("members");

	// Create a unique index on the "admin_number" field
	await collection.createIndex({ admin_number: 1 }, { unique: true });

	console.log(`members MongoDB connected and index created.`);
};

// call the function to initislie the database
initDatabase();

// get list of all members info
router.get("/", async (req, res) => {
	try {
		const collection = await db.collection("members");
		let result = await collection.find({}).toArray();

		if (result.length !== 0) {
			return res.status(200).send(successResponse("Members retrieved", result));
		} else {
			return res
				.status(200)
				.send(successResponse("There is currently no members", result));
		}
	} catch (e) {
		console.error("Error fetching all members info:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// get member info by id
router.get("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.findOne(query);

		if (result) {
			return res.status(200).send(successResponse("Member retrieved", result));
		} else {
			return res.status(404).send(errorResponse("Member not found"));
		}
	} catch (e) {
		console.error("Error fetching member by ID:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// create new member
router.post("/", async (req, res) => {
	try {
		const newMember = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			contact_number: req.body.contact_number,
			admin_number: req.body.admin_number,
			study_year: req.body.study_year,
			activeness: req.body.activeness,
			profile_image: req.body.profile_image,
			role: "member",
		};

		if (areFieldsEmpty(newMember)) {
			return res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else if (!isValidEmail(newMember.email)) {
			return res.status(400).send(errorResponse("Please input a valid email."));
		} else if (!isValidContactNumber(newMember.contact_number)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid contect number."));
		} else if (!isValidAdminNumber(newMember.admin_number)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid admin number."));
		} else if (
			await !checkAdminNumberExistsInJoinRequests(newMember.admin_number)
		) {
			return res
				.status(400)
				.send(errorResponse("Accept join request to create this member"));
		} else if (!isValidYearOfStudy(newMember.study_year)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid year of study(1,2 or 3)."));
		} else if (!isValidActiveness(newMember.activeness)) {
			return res
				.status(400)
				.send(errorResponse("Please input a vaild activeness."));
		} else if (!isValidProfileImage(newMember.profile_image)) {
			return res
				.status(400)
				.send(errorResponse("Please upload cover image in base64 format."));
		} else {
			// formatting values
			newMember.first_name = firstUpperCase(newMember.first_name);
			newMember.last_name = firstUpperCase(newMember.last_name);
			newMember.email = newMember.email.toLowerCase();
			newMember.admin_number = newMember.admin_number.toUpperCase();
			newMember.activeness = newMember.activeness.toLowerCase();

			const collection = await db.collection("members");
			let result = await collection.insertOne(newMember);

			return res.status(200).send(successResponse("Member created", result));
		}
	} catch (e) {
		if (e.code === 11000) {
			console.error("Admin number already registered.", e);
			return res
				.status(500)
				.send(errorResponse("Admin number already registered, try another."));
		} else {
			console.error("Error creating new member:", e);
			return res.status(500).send(errorResponse("Internal Server Error", e));
		}
	}
});

// update member info by id
router.patch("/:id", async (req, res) => {
	try {
		const updates = {
			$set: {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				contact_number: req.body.contact_number,
				admin_number: req.body.admin_number,
				study_year: req.body.study_year,
				activeness: req.body.activeness,
				profile_image: req.body.profile_image,
				role: req.body.role,
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
		} else if (
			updates.$set.hasOwnProperty("email") &&
			!isValidEmail(updates.$set.email)
		) {
			return res.status(400).send(errorResponse("Please input a valid email."));
		} else if (
			updates.$set.hasOwnProperty("contact_number") &&
			!isValidContactNumber(updates.$set.contact_number)
		) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid contect number."));
		} else if (
			updates.$set.hasOwnProperty("study_year") &&
			!isValidYearOfStudy(updates.$set.study_year)
		) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid year of study(1,2 or 3)."));
		} else if (
			updates.$set.hasOwnProperty("activeness") &&
			!isValidActiveness(updates.$set.activeness)
		) {
			return res
				.status(400)
				.send(errorResponse("Please input a vaild activeness."));
		} else if (
			updates.$set.hasOwnProperty("profile_image") &&
			!isValidProfileImage(updates.$set.profile_image)
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
					if (key === "first_name" || key === "last_name") {
						updates.$set[key] = firstUpperCase(updates.$set[key]);
					} else if (key === "email") {
						updates.$set[key] = updates.$set[key].toLowerCase();
					} else if (key === "activeness") {
						updates.$set[key] = updates.$set[key].toLowerCase();
					} else if (key === "role") {
						updates.$set[key] = updates.$set[key].toLowerCase();
					}
				}
			});

			const query = { _id: new ObjectId(req.params.id) };
			const collection = await db.collection("members");
			let result = await collection.updateOne(query, updates);

			if (result.matchedCount === 1) {
				if (result.modifiedCount === 1) {
					res
						.status(200)
						.send(
							successResponse(`${req.params.id} Member is updated`, result)
						);
				} else {
					return res
						.status(200)
						.send(successResponse(`Member is up to date`, result));
				}
			} else {
				res
					.status(404)
					.send(
						errorResponse("Member not found. Failed to update member", result)
					);
			}
		}
	} catch (e) {
		if (e.code === 11000) {
			console.error("Admin number already registered.", e);
			return res
				.status(500)
				.send(errorResponse("Admin number already registered, try another."));
		} else {
			console.error("Error updating member info:", e);
			return res.status(500).send(errorResponse("Internal Server Error", e));
		}
	}
});

// delete member by id
router.delete("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.deleteOne(query);

		if (result.deletedCount !== 0) {
			return res.status(200).send(successResponse("Member deleted", result));
		} else {
			return res
				.status(404)
				.send(errorResponse("Failed to delete member", result));
		}
	} catch (e) {
		console.error("Error deleting member by ID:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

export default router;
