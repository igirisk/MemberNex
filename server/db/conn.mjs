import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/MemberNex");

async function connectToMongoDB() {
	let conn;

	try {
		console.log("Connecting to local MongoDB...");
		conn = await client.connect();
		console.log("Connected to MongoDB successfully");

		return conn.db("MemberNex");
	} catch (e) {
		console.error("Error connecting to MongoDB:", e);
		throw e; // Rethrow the error after logging
	}
}

const db = await connectToMongoDB();

export default db;
