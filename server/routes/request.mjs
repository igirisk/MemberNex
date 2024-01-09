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
	// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
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

function isValidActiveness(activeness) {
	const value = ["very high", "high", "medium", "low", "very low", "inactive"];
	return value.includes(activeness.toLowerCase());
}

// get list of all join request
router.get("/", async (req, res) => {
	try {
		const collection = await db.collection("members");
		let result = await collection.find({}).toArray();

		if (result.length !== 0) {
			res.status(200).send(successResponse("Join requests retrieved", result));
		} else {
			res.status(404).send(errorResponse("There is currently no join request"));
		}
	} catch (e) {
		console.error("Error fetching all join requests:", e);
		res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// create new join request
router.post("/", async (req, res) => {
	try {
		const newMember = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			contact_number: req.body.contact_number,
			matrix_number: req.body.matrix_number,
			study_year: req.body.study_year,
			activeness: req.body.activeness,
			request: true,
		};

		if (areFieldsEmpty(newMember)) {
			res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else if (!isValidEmail(newMember.email)) {
			res.status(400).send(errorResponse("Please input a valid email."));
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
			// formatting values
			newMember.first_name = firstUpperCase(newMember.first_name);
			newMember.last_name = firstUpperCase(newMember.last_name);
			newMember.email = newMember.email.toLowerCase();
			newMember.matrix_number = newMember.matrix_number.toUpperCase();
			newMember.activeness = newMember.activeness.toLowerCase();

			const collection = await db.collection("members");
			let result = await collection.insertOne(newMember);

			res.status(200).send(successResponse("Join request sended", result));
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

// reject join request by id
router.delete("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.deleteOne(query);

		if (result.deletedCount !== 0) {
			res.status(200).send(successResponse("Join request rejected", result));
		} else {
			res.status(404).send(errorResponse("Failed to reject request", result));
		}
	} catch (e) {
		console.error("Error rejecting request by ID:", e);
		res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

export default router;
