import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3050;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
	res.send("hello world").status(200);
});

// start the Express server
app.listen(PORT, () => {
	console.log(`server is running on port: http://localhost:${PORT}`);
});
