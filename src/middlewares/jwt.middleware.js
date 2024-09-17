const jwt = require('jsonwebtoken');
// require('dotenv').config();

class JWTMiddleware {
    
    verifyToken(req, res, next) {
        // Extract token from Authorization header as 'Bearer <token>'
        const token = req.headers.authorization.split(' ')[1].trim();

        // If no token is provided, return 401 Unauthorized
        if (!token) {
            return res.status(401).json({ "message": "Unauthorized - No token provided" });
        }

        try {
            // Verifying the JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user information to the request object
            req.user = decoded;
            return next();
        } catch (error) {
            // Handle specific JWT error cases like token expiration
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ "message": "Unauthorized - Token expired" });
            }

            return res.status(401).json({ "message": "Unauthorized - Invalid token" });
        }
    }

    generateToken(payload) {
        // Create and sign a new JWT token
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    }
}

const jwtMiddleware = new JWTMiddleware();
module.exports = jwtMiddleware;
