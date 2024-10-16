import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Adjust path as necessary
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify'; // Import toast

const ProtectedRoute = ({ children, setShowLogin }) => {
    const { user } = useAuthStore(); // Assuming your auth store has these properties
    const { isLoggedIn } = useContext(StoreContext);
    const navigate = useNavigate();
    const userRole = user?.role; // Use optional chaining to avoid errors if user is undefined

    useEffect(() => {
        console.log("ProtectedRoute: Checking authentication status...");
        console.log("Is Logged In:", isLoggedIn);
        console.log("User Role:", userRole);

        // Check if the user is not logged in
        if (!isLoggedIn) {
            console.log("ProtectedRoute: User is not logged in. Showing login modal and navigating to home.");
            setShowLogin(true); // Show the login modal
            navigate('/'); // Navigate to the home page
        } else if (userRole === 'MANAGER') {
            // If the user is a MANAGER, navigate to the orders page and show a toast message
            console.log("ProtectedRoute: User is a MANAGER. Not authorized. Navigating to orders.");
            toast.error("Not authorized");
            navigate('/orders'); // Navigate to the orders page
        } else if (userRole !== 'ADMIN') {
            console.log("ProtectedRoute: User is not authorized. Showing login modal and navigating to home.");
            setShowLogin(true); // Show the login modal
            navigate('/'); // Navigate to the home page
        } else {
            console.log("ProtectedRoute: User is authorized.");
        }
    }, [isLoggedIn, userRole, navigate, setShowLogin]); // Add dependencies

    // Prevent rendering the child components if unauthorized
    if (!isLoggedIn || userRole !== 'ADMIN') {
        console.log("ProtectedRoute: User is not authorized. Rendering nothing.");
        return null; // Render nothing while navigating
    }

    console.log("ProtectedRoute: User is authorized. Rendering children.");
    return children; // Render the child components if authorized
};

const ProtectedRouteForManager = ({ children, setShowLogin }) => {
    const { user } = useAuthStore(); // Get user details from auth store
    const { isLoggedIn } = useContext(StoreContext); // Assuming your auth store has this property
    const navigate = useNavigate();
    const userRole = user?.role; // Use optional chaining to avoid errors if user is undefined

    useEffect(() => {
        console.log("ProtectedRouteForManager: Checking authentication status...");
        console.log("Is Logged In:", isLoggedIn);
        console.log("User Role:", userRole);

        // Check if the user is not logged in or does not have manager or admin role
        if (!isLoggedIn || (userRole !== 'MANAGER' && userRole !== 'ADMIN')) {
            console.log("ProtectedRouteForManager: User is not authorized. Showing login modal and navigating to home.");
            toast.error("Not authorized"); // Show toast message for unauthorized access
            setShowLogin(true); // Show the login modal
            navigate('/'); // Navigate to the home page
        } else {
            console.log("ProtectedRouteForManager: User is authorized.");
        }
    }, [isLoggedIn, userRole, navigate, setShowLogin]); // Add dependencies

    // Prevent rendering the child components if unauthorized
    if (!isLoggedIn || (userRole !== 'MANAGER' && userRole !== 'ADMIN')) {
        console.log("ProtectedRouteForManager: User is not authorized. Rendering nothing.");
        return null; // Render nothing while navigating
    }

    console.log("ProtectedRouteForManager: User is authorized. Rendering children.");
    return children; // Render the child components if authorized
};

export { ProtectedRoute, ProtectedRouteForManager };
