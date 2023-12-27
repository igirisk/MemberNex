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

// Funtion to set first character in string to uppercase
function firstUpperCase(str) {
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isValidActiveness(activeness) {
	const value = ["very high", "high", "medium", "low", "very low", "inactive"];
	return value.includes(activeness.toLowerCase());
}

function isValidContactNumber(contact_number) {
	const contactNumberRegex = /^\d{8}$/; // 8 digit contact number
	return contactNumberRegex.test(contact_number);
}

function isValidMatrixNumber(matrix_number) {
	const matrixNumberRegex = /^\d{6}[A-Za-z]$/; // 6 digit before a alphabet
	return matrixNumberRegex.test(matrix_number);
}

function isValidYearOfStudy(study_year) {
	const value = [1, 2, 3];
	return value.includes(study_year);
}

// get list of all members info
router.get("/", async (req, res) => {
	try {
		const collection = await db.collection("members");
		let result = await collection.find({}).toArray();

		if (result.length !== 0) {
			res.status(200).send(successResponse("Members retrieved", result));
		} else {
			res.status(404).send(errorResponse("There is currently no members"));
		}
	} catch (e) {
		console.error("Error fetching all members info:", e);
		res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// get member info by id
router.get("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.findOne(query);

		if (result) {
			res.status(200).send(successResponse("Member retrieved", result));
		} else {
			res.status(404).send(errorResponse("Member not found"));
		}
	} catch (e) {
		console.error("Error fetching member by ID:", e);
		res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// create new member
router.post("/", async (req, res) => {
	try {
		const newMember = {
			first_name: firstUpperCase(req.body.first_name),
			last_name: firstUpperCase(req.body.last_name),
			email: req.body.email.toLowerCase(),
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
			contact_number: req.body.contact_number,
			matrix_number: req.body.matrix_number.toUpperCase(),
			study_year: req.body.study_year,
			activeness: req.body.activeness.toLowerCase(),
			request: true,
		};

		if (areFieldsEmpty(newMember)) {
			res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else if (!isValidEmail(newMember.email)) {
			res.status(400).send(errorResponse("Please input a valid email."));
		} else if (newMember.password !== newMember.confirmPassword) {
			res
				.status(400)
				.send(errorResponse("Password and confirm password does not match."));
		} else if (!isValidContactNumber(newMember.contact_number)) {
			res
				.status(400)
				.send(errorResponse("Please input a valid contect number."));
		} else if (!isValidMatrixNumber(newMember.matrix_number)) {
			res
				.status(400)
				.send(errorResponse("Please input a valid matrix card number."));
		} else if (!isValidYearOfStudy(newMember.study_year)) {
			res
				.status(400)
				.send(errorResponse("Please input a valid year of study(1,2 or 3)."));
		} else if (!isValidActiveness(newMember.activeness)) {
			res.status(400).send(errorResponse("Please input a vaild activeness"));
		} else {
			delete newMember.confirmPassword;
			const collection = await db.collection("members");
			let result = await collection.insertOne(newMember);

			res.status(200).send(successResponse("Member created", result));
		}
	} catch (e) {
		if (e.code === 11000) {
			console.error("Matrix number already registered.", e);
			res
				.status(500)
				.send(errorResponse("Matrix number already registered, try another."));
		} else {
			console.error("Error creating new member:", e);
			res.status(500).send(errorResponse("Internal Server Error", e));
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
				password: req.body.password,
				contact_number: req.body.contact_number,
				matrix_number: req.body.matrix_number,
				study_year: req.body.study_year,
				activeness: req.body.activeness,
				request: true,
			},
		};

		// add confirm password
		// add form fields vaildation

		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.updateOne(query, updates);

		if (result.matchedCount === 1) {
			if (result.modifiedCount === 1) {
				res
					.status(200)
					.send(successResponse(`${req.params.id} Member is updated`, result));
			} else {
				res.status(200).send(successResponse(`Member is up to date`, result));
			}
		} else {
			res
				.status(404)
				.send(
					errorResponse("Member not found. Failed to update member", result)
				);
		}
	} catch (e) {
		console.error("Error updating member info:", e);
		res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// delete member by id
router.delete("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.deleteOne(query);

		if (result.deletedCount !== 0) {
			res.status(200).send(successResponse("Member deleted", result));
		} else {
			res.status(404).send(errorResponse("Failed to delete member", result));
		}
	} catch (e) {
		console.error("Error deleting member by ID:", e);
		res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

export default router;
