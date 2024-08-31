import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    console.log("Received token:", token);  // Log the token for debugging

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY_CONSUMER);

        console.log("Decoded token payload:", decoded);  

        req.userId = decoded.id;  
        req.userName = decoded.name;  
        req.userEmail = decoded.email;  

        console.log("User ID from token:", req.userId);  

        next();  
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
        }
        console.log('Token verification error:', error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
