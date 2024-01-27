import express from "express";
import cors from "cors";
import members from "./routes/members.mjs";
import joinRequest from "./routes/joinRequest.mjs";
import event from "./routes/events.mjs";

const PORT = process.env.PORT || 3050;
const app = express();

app.use(cors());
// Increase payload size limit to 10 megabytes
app.use(express.json({ limit: "5mb" }));

// member router for member api endpoints
app.use("/member", members);

// joinRequest router for joinRequest api endpoints
app.use("/joinRequest", joinRequest);

// event router for event api endpoints
app.use("/event", event);

// start the Express server
app.listen(PORT, () => {
	console.log(`server is running on port: http://localhost:${PORT}`);
});
