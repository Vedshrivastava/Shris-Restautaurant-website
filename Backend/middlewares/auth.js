import jwt from 'jsonwebtoken';

// Middleware for consumer authentication
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received token:", token); // Log the token for debugging

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized: No token provided." });
    }

    if (token.split('.').length !== 3) {
        console.log('Invalid token format:', token);
        return res.status(401).json({ success: false, message: "Invalid token format." });
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
        return res.status(401).json({ success: false, message: "Invalid token: " + error.message });
    }
};

// Middleware for admin authentication
const adminAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received token for admin:", token); // Log the token for debugging

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized: No token provided." });
    }

    if (token.split('.').length !== 3) {
        console.log('Invalid token format:', token);
        return res.status(401).json({ success: false, message: "Invalid token format." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY_ADMIN);
        console.log("Decoded admin token payload:", decoded);  

        req.userId = decoded._id;  
        req.userName = decoded.name;  
        req.userEmail = decoded.email;  

        console.log("Admin User ID from token:", req.userId);  
        next();  
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
        }
        console.log('Admin token verification error:', error);
        return res.status(401).json({ success: false, message: "Invalid token: " + error.message });
    }
};

// Middleware for manager authentication
const managerAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received token for manager:", token); // Log the token for debugging

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized: No token provided." });
    }

    if (token.split('.').length !== 3) {
        console.log('Invalid token format:', token);
        return res.status(401).json({ success: false, message: "Invalid token format." });
    }

    // Try to verify the token as a manager first
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY_MANAGER);
        console.log("Decoded manager token payload:", decoded);  

        req.userId = decoded.id;  
        req.userName = decoded.name;  
        req.userEmail = decoded.email;  

        console.log("Manager User ID from token:", req.userId);  
        next();  
    } catch (error) {
        console.log('Manager token verification error:', error);

        // If the manager token verification fails, try admin token
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY_ADMIN);
            console.log("Decoded admin token payload:", decoded);  

            req.userId = decoded._id;  
            req.userName = decoded.name;  
            req.userEmail = decoded.email;  

            console.log("Admin User ID from token:", req.userId);  
            next();  
        } catch (adminError) {
            if (adminError.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
            }
            console.log('Admin token verification error:', adminError);
            return res.status(401).json({ success: false, message: "Invalid token for both manager and admin: " + adminError.message });
        }
    }
};

export { adminAuthMiddleware, authMiddleware, managerAuthMiddleware };
