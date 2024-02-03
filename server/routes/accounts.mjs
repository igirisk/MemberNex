import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { secretkey, tokenBlacklist } from "./verifyToken.mjs";

import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";
import qrcode from "qrcode";

const router = express.Router();

const successResponse = (message, data = null) => {
	return { success: true, message, data };
};

const errorResponse = (message, details = null) => {
	return { success: false, error: message, details };
};

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

async function sendVerificationEmail(admin_number, email, otpauth_url) {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			secure: false,
			auth: {
				user: "fwb2fa@gmail.com",
				pass: "vcjy dbtj lrbn asht",
			},
		});

		qrcode.toDataURL(otpauth_url, function (err, data) {
			if (err) {
				console.error("Error generating QR code:", err);
				reject(err);
			} else {
				let mailOptions = {
					from: "fwb2fa@gmail.com",
					to: email,
					subject: "2-Factor Verification for MemberNex",
					html: `<p>To enhance the security of your ${admin_number} MemberNex account, we have enabled 2-Factor Authentication. Please follow the instructions below to set up 2FA:</p>
                    <ol>
                        <li>Download and install a 2FA app on your mobile device (e.g., Google Authenticator).</li>
                        <li>Open the 2FA app and scan the QR code below.</li>
                    </ol>
                    <img src="cid:unique@nodemailer.com" alt="2FA QR Code"/>`,
					attachments: [
						{
							filename: "qrcode.png",
							content: data.split(";base64,")[1],
							encoding: "base64",
							cid: "unique@nodemailer.com",
						},
					],
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.error("Error sending email:", error);
						reject(error);
					} else {
						resolve();
					}
				});
			}
		});
	});
}

// create new account
router.post("/register", async (req, res) => {
	try {
		let secret2fa = speakeasy.generateSecret({
			name: "MemberNex",
		});

		const newAccount = {
			admin_number: req.body.admin_number,
			email: req.body.email,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
			secret2fa: secret2fa,
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

			//number of times password hashing is applied to password
			const saltRounds = 10;
			// hash password
			const hashedPassword = await bcrypt.hash(newAccount.password, saltRounds);
			newAccount.password = hashedPassword;

			const collection = await db.collection("accounts");
			let result;

			try {
				result = await collection.insertOne(newAccount);

				// Sending verification QR code only if database insertion is successful
				await sendVerificationEmail(
					newAccount.admin_number,
					newAccount.email,
					secret2fa.otpauth_url
				);

				return res
					.status(200)
					.send(successResponse("Account created successfully", result));
			} catch (e) {
				// Handle database insertion error
				if (e.code === 11000) {
					console.error("Admin number already registered.", e);
					return res
						.status(500)
						.send(
							errorResponse("Admin number already registered, try another.")
						);
				} else {
					console.error("Error creating new account:", e);
					return res
						.status(500)
						.send(errorResponse("Internal Server Error", e));
				}
			}
		}
	} catch (e) {
		console.error("Error creating new account:", e);
		return res.status(500).send(errorResponse("Internal Server Error", e));
	}
});

router.post("/login", async (req, res) => {
	try {
		const admin_number = req.body.admin_number;
		const password = req.body.password;
		const otp = req.body.otp;

		if (!admin_number || !password || !otp) {
			return res
				.status(400)
				.send(errorResponse("Please fill in all the input fields."));
		} else {
			const collection = await db.collection("accounts");
			const user = await collection.findOne({ admin_number });
			// check if entered password matches with hashed password in database
			const matchPassword = await bcrypt.compare(password, user.password);

			if (matchPassword) {
				const verified = speakeasy.totp.verify({
					secret: user.secret2fa.ascii,
					encoding: "ascii",
					token: otp,
				});

				if (verified) {
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
						.send(errorResponse("Invalid 2 factor authentication otp"));
				}
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

// logout and terminate jwt token
router.post("/logout", async (req, res) => {
	try {
		const token = req.headers.authorization;

		// Blacklist the token or perform any other termination logic
		tokenBlacklist.add(token);

		return res.status(200).send(successResponse("Token terminated"));
	} catch (error) {
		console.error("Error terminating token:", error);
		res.status(500).send(errorResponse("Internal Server Error", error));
	}
});

// update account info by id
router.patch("/:id", async (req, res) => {
	try {
		const updates = {
			$set: {
				email: req.body.email,
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
		} else if (
			updates.$set.hasOwnProperty("email") &&
			!isValidEmail(updates.$set.email)
		) {
			return res.status(400).send(errorResponse("Please input a valid email."));
		} else if (
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
			delete updates.$set.confirmPassword;

			if (updates.$set.hasOwnProperty("password")) {
				//number of times password hashing is applied to password
				const saltRounds = 10;
				// hash password
				const hashedPassword = await bcrypt.hash(
					updates.$set.password,
					saltRounds
				);
				updates.$set.password = hashedPassword;
			}

			const query = { _id: new ObjectId(req.params.id) };
			const collection = await db.collection("accounts");
			let result = await collection.updateOne(query, updates);

			if (result.matchedCount === 1) {
				if (result.modifiedCount === 1) {
					return res
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
				return res
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
