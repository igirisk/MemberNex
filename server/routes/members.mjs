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
		let newMember = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: req.body.password,
			contact_number: req.body.contact_number,
			matrix_number: req.body.matrix_number,
			study_year: req.body.study_year,
			activeness: req.body.activeness,
			request: true,
		};
		//need to do vaildation here. and confrim password

		const collection = await db.collection("members");
		let result = await collection.insertOne(newMember);

		res.status(200).send(successResponse("Member created", result));
	} catch (e) {
		console.error("Error creating new member:", e);
		res.status(500).send("Internal Server Error");
	}
});

// update member info by id
router.patch("/:id", async (req, res) => {
	try {
		let updates = {
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
