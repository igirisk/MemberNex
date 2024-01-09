import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// const successResponse = (message, data = null) => {
// 	return { success: true, message, data };
// };

// const errorResponse = (message, details = null) => {
// 	return { success: false, error: message, details };
// };

// // Function to check if fields are empty
// function areFieldsEmpty(member) {
// 	for (let key in member) {
// 		if (
// 			member.hasOwnProperty(key) &&
// 			(member[key] === undefined || member[key] === null || member[key] === "")
// 		) {
// 			return true; // Field is empty
// 		}
// 	}
// 	return false; // No empty fields found
// }

// // Funtion to set first character in string to uppercase
// function firstUpperCase(str) {
// 	return str[0].toUpperCase() + str.slice(1).toLowerCase();
// }

// function isValidEmail(email) {
// 	// one or more characters that is not white space before @, contains @, one or more characters that is not white space after @, contains .,one or more chatacters that matches is not white space till the end of the str
// 	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 	return emailRegex.test(email);
// }

// function isValidPassword(password) {
// 	// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character
// 	const passwordRegex =
// 		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;

// 	return passwordRegex.test(password);
// }

// function isValidContactNumber(contact_number) {
// 	const contactNumberRegex = /^\d{8}$/; // 8 digit contact number
// 	return contactNumberRegex.test(contact_number);
// }

// function isValidMatrixNumber(matrix_number) {
// 	const matrixNumberRegex = /^\d{6}[A-Za-z]$/; // 6 digit before a alphabet
// 	return matrixNumberRegex.test(matrix_number);
// }

// function isValidYearOfStudy(study_year) {
// 	const value = [1, 2, 3];
// 	return value.includes(study_year);
// }

// function isValidActiveness(activeness) {
// 	const value = ["very high", "high", "medium", "low", "very low", "inactive"];
// 	return value.includes(activeness.toLowerCase());
// }

// // get list of all members info
// router.get("/", async (req, res) => {
// 	try {
// 		const collection = await db.collection("members");
// 		let result = await collection.find({}).toArray();

// 		if (result.length !== 0) {
// 			res.status(200).send(successResponse("Members retrieved", result));
// 		} else {
// 			res.status(404).send(errorResponse("There is currently no members"));
// 		}
// 	} catch (e) {
// 		console.error("Error fetching all members info:", e);
// 		res.status(500).send(errorResponse("Internal Server Error", e));
// 	}
// });

// // get member info by id
// router.get("/:id", async (req, res) => {
// 	try {
// 		const query = { _id: new ObjectId(req.params.id) };
// 		const collection = await db.collection("members");
// 		let result = await collection.findOne(query);

// 		if (result) {
// 			res.status(200).send(successResponse("Member retrieved", result));
// 		} else {
// 			res.status(404).send(errorResponse("Member not found"));
// 		}
// 	} catch (e) {
// 		console.error("Error fetching member by ID:", e);
// 		res.status(500).send(errorResponse("Internal Server Error", e));
// 	}
// });

// // create new member
// router.post("/", async (req, res) => {
// 	try {
// 		const newMember = {
// 			first_name: req.body.first_name,
// 			last_name: req.body.last_name,
// 			email: req.body.email,
// 			password: req.body.password,
// 			confirmPassword: req.body.confirmPassword,
// 			contact_number: req.body.contact_number,
// 			matrix_number: req.body.matrix_number,
// 			study_year: req.body.study_year,
// 			activeness: req.body.activeness,
// 			request: true,
// 		};

// 		if (areFieldsEmpty(newMember)) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please fill in all the input fields."));
// 		} else if (!isValidEmail(newMember.email)) {
// 			res.status(400).send(errorResponse("Please input a valid email."));
// 		} else if (!isValidPassword(newMember.password)) {
// 			res
// 				.status(400)
// 				.send(
// 					errorResponse(
// 						"Password contains at least eight characters, one uppercase letter, one lowercase letter, one number, and one special character."
// 					)
// 				);
// 		} else if (newMember.password !== newMember.confirmPassword) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Password and confirm password does not match."));
// 		} else if (!isValidContactNumber(newMember.contact_number)) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please input a valid contect number."));
// 		} else if (!isValidMatrixNumber(newMember.matrix_number)) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please input a valid matrix card number."));
// 		} else if (!isValidYearOfStudy(newMember.study_year)) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please input a valid year of study(1,2 or 3)."));
// 		} else if (!isValidActiveness(newMember.activeness)) {
// 			res.status(400).send(errorResponse("Please input a vaild activeness"));
// 		} else {
// 			delete newMember.confirmPassword;

// 			// formatting values
// 			newMember.first_name = firstUpperCase(newMember.first_name);
// 			newMember.last_name = firstUpperCase(newMember.last_name);
// 			newMember.email = newMember.email.toLowerCase();
// 			newMember.matrix_number = newMember.matrix_number.toUpperCase();
// 			newMember.activeness = newMember.activeness.toLowerCase();

// 			const collection = await db.collection("members");
// 			let result = await collection.insertOne(newMember);

// 			res.status(200).send(successResponse("Member created", result));
// 		}
// 	} catch (e) {
// 		if (e.code === 11000) {
// 			console.error("Matrix number already registered.", e);
// 			res
// 				.status(500)
// 				.send(errorResponse("Matrix number already registered, try another."));
// 		} else {
// 			console.error("Error creating new member:", e);
// 			res.status(500).send(errorResponse("Internal Server Error", e));
// 		}
// 	}
// });

// // update member info by id
// router.patch("/:id", async (req, res) => {
// 	try {
// 		const updates = {
// 			$set: {
// 				first_name: req.body.first_name,
// 				last_name: req.body.last_name,
// 				email: req.body.email,
// 				password: req.body.password,
// 				confirmPassword: req.body.confirmPassword,
// 				contact_number: req.body.contact_number,
// 				study_year: req.body.study_year,
// 				activeness: req.body.activeness,
// 			},
// 		};
// 		for (let key in updates.$set) {
// 			if (
// 				updates.$set.hasOwnProperty(key) &&
// 				(updates.$set[key] === undefined ||
// 					updates.$set[key] === null ||
// 					updates.$set[key] === "")
// 			) {
// 				delete updates.$set[key];
// 			}
// 		}

// 		// add form fields vaildation
// 		if (Object.keys(updates.$set).length === 0) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please fill in input fields to update."));
// 		}
// 		if (
// 			updates.$set.hasOwnProperty("email") &&
// 			!isValidEmail(updates.$set.email)
// 		) {
// 			res.status(400).send(errorResponse("Please input a valid email."));
// 		} else if (
// 			updates.$set.hasOwnProperty("password") &&
// 			!isValidPassword(updates.$set.password)
// 		) {
// 			res
// 				.status(400)
// 				.send(
// 					errorResponse(
// 						"Password must contain at least eight characters, one uppercase letter, one lowercase letter, one number, and one special character."
// 					)
// 				);
// 		} else if (
// 			updates.$set.hasOwnProperty("password") &&
// 			updates.$set.hasOwnProperty("confirmPassword") &&
// 			updates.$set.password !== updates.$set.confirmPassword
// 		) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Password and confirm password do not match."));
// 		} else if (
// 			updates.$set.hasOwnProperty("contact_number") &&
// 			!isValidContactNumber(updates.$set.contact_number)
// 		) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please input a valid contect number."));
// 		} else if (
// 			updates.$set.hasOwnProperty("study_year") &&
// 			!isValidYearOfStudy(updates.$set.study_year)
// 		) {
// 			res
// 				.status(400)
// 				.send(errorResponse("Please input a valid year of study(1,2 or 3)."));
// 		} else if (
// 			updates.$set.hasOwnProperty("activeness") &&
// 			!isValidActiveness(updates.$set.activeness)
// 		) {
// 			res.status(400).send(errorResponse("Please input a vaild activeness"));
// 		} else {
// 			delete updates.$set.confirmPassword;
// 			// formatting values
// 			const keysToCheck = ["first_name", "last_name", "email", "activeness"];

// 			keysToCheck.forEach((key) => {
// 				if (updates.$set.hasOwnProperty(key)) {
// 					// Check the key and perform the corresponding operation
// 					if (key === "first_name" || key === "last_name") {
// 						updates.$set[key] = firstUpperCase(updates.$set[key]);
// 					} else if (key === "email") {
// 						updates.$set[key] = updates.$set[key].toLowerCase();
// 					} else if (key === "activeness") {
// 						updates.$set[key] = updates.$set[key].toLowerCase();
// 					}
// 				}
// 			});

// 			const query = { _id: new ObjectId(req.params.id) };
// 			const collection = await db.collection("members");
// 			let result = await collection.updateOne(query, updates);

// 			if (result.matchedCount === 1) {
// 				if (result.modifiedCount === 1) {
// 					res
// 						.status(200)
// 						.send(
// 							successResponse(`${req.params.id} Member is updated`, result)
// 						);
// 				} else {
// 					res.status(200).send(successResponse(`Member is up to date`, result));
// 				}
// 			} else {
// 				res
// 					.status(404)
// 					.send(
// 						errorResponse("Member not found. Failed to update member", result)
// 					);
// 			}
// 		}
// 	} catch (e) {
// 		console.error("Error updating member info:", e);
// 		res.status(500).send(errorResponse("Internal Server Error", e));
// 	}
// });

// // delete member by id
// router.delete("/:id", async (req, res) => {
// 	try {
// 		const query = { _id: new ObjectId(req.params.id) };
// 		const collection = await db.collection("members");
// 		let result = await collection.deleteOne(query);

// 		if (result.deletedCount !== 0) {
// 			res.status(200).send(successResponse("Member deleted", result));
// 		} else {
// 			res.status(404).send(errorResponse("Failed to delete member", result));
// 		}
// 	} catch (e) {
// 		console.error("Error deleting member by ID:", e);
// 		res.status(500).send(errorResponse("Internal Server Error", e));
// 	}
// });

export default router;
