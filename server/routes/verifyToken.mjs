import jwt from "jsonwebtoken";
const secretkey = "ALLAONLY132121321";

//this func is a middleware that will be
// executed before the route funcs to check for token
const verifyToken = (req, res, next) => {
	// extract token from req header
	const token = req.headers.authorization;
	console.log("token in backend: " + token);
	// no token
	if (!token) {
		return res.status(403).send("No token provided");
	}

	// if token present, it decode and verify the token authenticity
	jwt.verify(token, secretkey, (err, decoded) => {
		console.log("token in verify: " + token);
		if (err) {
			return res.status(401).send("Invalid token");
		}

		// retrieve the decoded token details req.user = decoded;
		req.user = decoded;
		console.log("Decoded token:", decoded);
		next();
	});
};

export default verifyToken;
