import jwt from "jsonwebtoken";
const secretkey = "ALLAONLY132121321";

// Maintain a blacklist of invalidated tokens
const tokenBlacklist = new Set();

const errorResponse = (message, details = null) => {
	return { success: false, error: message, details };
};

//this func is a middleware that will be
// executed before the route funcs to check for token
const verifyToken = (req, res, next) => {
	// extract token from req header
	const token = req.headers.authorization;

	// no token
	if (!token) {
		return res.status(403).send("No token provided");
	}

	// Check if the token is in the blacklist
	if (tokenBlacklist.has(token)) {
		return res.status(401).send(errorResponse("Token has been terminated"));
	}

	// if token present, it decode and verify the token authenticity
	jwt.verify(token, secretkey, (err, decoded) => {
		if (err) {
			return res.status(401).send("Invalid token");
		}

		// retrieve the decoded token details req.user = decoded;
		req.user = decoded;
		next();
	});
};

export { verifyToken, secretkey, tokenBlacklist };
