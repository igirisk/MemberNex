import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

const secretkey = "ALLAONLY132121321";

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
function areFieldsEmpty(account) {
	for (let key in account) {
		if (
			account.hasOwnProperty(key) &&
			(account[key] === undefined ||
				account[key] === null ||
				account[key] === "")
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

function isValidPassword(password) {
	// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;

	return passwordRegex.test(password);
}

function isValidAdminNumber(admin_number) {
	const adminNumberRegex = /^\d{7}[A-Za-z]$/; // 7 digit before a alphabet
	return adminNumberRegex.test(admin_number);
}
// #endregion

// Connect to the MongoDB database and create a unique index on the "adminno" field
const initDatabase = async () => {
	const collection = await db.collection("accounts");

	// Create a unique index on the "adminno" field
	await collection.createIndex({ admin_number: 1 }, { unique: true });

	console.log(`accounts MongoDB connected and index created.`);
};
// call the function to initislie the database
initDatabase();

// create new account
router.post("/register", async (req, res) => {
	try {
		const newAccount = {
			admin_number: req.body.admin_number,
			email: req.body.email,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
		};

		if (areFieldsEmpty(newAccount)) {
			return res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else if (!isValidEmail(newAccount.email)) {
			return res.status(400).send(errorResponse("Please input a valid email."));
		} else if (!isValidAdminNumber(newAccount.admin_number)) {
			return res
				.status(400)
				.send(errorResponse("Please input a valid admin number."));
		} else if (!isValidPassword(newAccount.password)) {
			return res
				.status(400)
				.send(
					errorResponse(
						"Password must be a minimum of eight characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
					)
				);
		} else if (newAccount.password !== newAccount.confirmPassword) {
			return res
				.status(400)
				.send(errorResponse("Password and Confirm Password do not match."));
		} else {
			// formatting values
			newAccount.admin_number = newAccount.admin_number.toUpperCase();
			delete newAccount.confirmPassword;

			const collection = await db.collection("accounts");
			let result = await collection.insertOne(newAccount);

			return res
				.status(200)
				.send(successResponse("Account created successfully", result));
		}
	} catch (e) {
		if (e.code === 11000) {
			console.error("Admin number already registered.", e);
			return res
				.status(500)
				.send(errorResponse("Admin number already registered, try another."));
		} else {
			console.error("Error creating new account:", e);
			return res.status(500).send(errorResponse("Internal Server Error", e));
		}
	}
});

router.post("/login", async (req, res) => {
	try {
		const admin_number = req.body.admin_number;
		const password = req.body.password;

		if (!admin_number || !password) {
			return res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else {
			const collection = await db.collection("accounts");
			const user = await collection.findOne({ admin_number, password });

			if (user) {
				// create a jwt token
				const token = jwt.sign(
					{ admin_number: user.admin_number, password: user.password },
					secretkey,
					{ expiresIn: "1h" }
				);
				// send the token in the response
				return res
					.status(200)
					.send(successResponse("Login successfully", { token: token }));
			} else {
				return res
					.status(401)
					.send(errorResponse("Invalid admin number or password"));
			}
		}
	} catch (e) {
		console.error("Error logging in:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// update account info by id
router.patch("/:id", async (req, res) => {
	try {
		const updates = {
			$set: {
				password: req.body.password,
				confirmPassword: req.body.confirmPassword,
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
			updates.$set.hasOwnProperty("password") &&
			!isValidPassword(updates.$set.password)
		) {
			return res
				.status(400)
				.send(
					errorResponse(
						"Password must be a minimum of eight characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
					)
				);
		} else if (updates.$set.password !== updates.$set.confirmPassword) {
			return res
				.status(400)
				.send(errorResponse("Password and Confirm Password do not match."));
		} else {
			delete updates.confirmPassword;

			const query = { _id: new ObjectId(req.params.id) };
			const collection = await db.collection("accounts");
			let result = await collection.updateOne(query, updates);

			if (result.matchedCount === 1) {
				if (result.modifiedCount === 1) {
					res
						.status(200)
						.send(
							successResponse(`${req.params.id} Account is updated`, result)
						);
				} else {
					return res
						.status(200)
						.send(successResponse(`Account is up to date`, result));
				}
			} else {
				res
					.status(404)
					.send(
						errorResponse("Account not found. Failed to update account", result)
					);
			}
		}
	} catch (e) {
		console.error("Error updating account info:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

// reject account by id
router.delete("/:id", async (req, res) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const collection = await db.collection("accounts");
		let result = await collection.deleteOne(query);

		if (result.deletedCount !== 0) {
			return res.status(200).send(successResponse("Account deleted", result));
		} else {
			return res
				.status(404)
				.send(errorResponse("Failed to delete account", result));
		}
	} catch (e) {
		console.error("Error deleting account by ID:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

export default router;
