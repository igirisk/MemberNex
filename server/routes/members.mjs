import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// get list of all members info
router.get("/", async (req, res) => {
	try {
		const collection = await db.collection("members");
		let results = await collection.find({}).toArray();

		res.status(200).send(results);
	} catch (e) {
		console.error("Error fetching all members info:", e);
		res.status(500).send("Internal Server Error");
	}
});

// get member info by id
router.get("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let results = await collection.findOne(query);

		if (!results) {
			res.status(404).send("Member not found");
		} else {
			res.status(200).send(results);
		}
	} catch (e) {
		console.error("Error fetching member by ID:", e);
		res.status(500).send("Internal Server Error");
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

		const collection = await db.collection("members");
		let result = await collection.insertOne(newMember);
		res.status(200).send(result);
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

		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.updateOne(query, updates);
		res.status(200).send(result);
	} catch (e) {
		console.error("Error updating member info:", e);
		res.status(500).send("Internal Server Error");
	}
});

// delete member by id
router.delete("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("members");
		let result = await collection.deleteOne(query);

		if (!result) {
			res.status(404).send("Member not found");
		} else {
			res.status(200).send(result);
		}
	} catch (e) {
		console.error("Error deleting member by ID:", e);
		res.status(500).send("Internal Server Error");
	}
});

export default router;
