import express from "express";
import cors from "cors";
import members from "./routes/members.mjs";

const PORT = process.env.PORT || 3050;
const app = express();

app.use(cors());
app.use(express.json());

// member router for member api endpoints
app.use("/member", members);

// start the Express server
app.listen(PORT, () => {
	console.log(`server is running on port: http://localhost:${PORT}`);
});
