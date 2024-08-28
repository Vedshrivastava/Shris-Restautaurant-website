import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_KEY_CONSUMER);

        console.log("Decoded token payload:", decoded);  // Log the decoded payload

        // Attach user information to the request object
        req.userId = decoded.id;  // Extract user ID from token payload
        req.userName = decoded.name;  // Optional: Attach name if needed
        req.userEmail = decoded.email;  // Optional: Attach email if needed

        console.log("User ID from token:", req.userId);  // Log the user ID attached to the request

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
        }
        console.log('Token verification error:', error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
