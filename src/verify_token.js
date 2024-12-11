const jwt = require('jsonwebtoken');

// Replace this with your actual secret key
const SECRET_KEY = "your_jwt_secret_key";

const verifyToken = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach decoded token data (e.g., userId, email) to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send({ error: "Invalid token." });
    }
};

module.exports = verifyToken;
