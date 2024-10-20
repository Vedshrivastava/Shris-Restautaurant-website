import React, { useState, useContext, useEffect } from 'react';
import '../styles/Login.css';
import { assets } from '../assets/frontend_assets/assets';
import { StoreContext } from '../context/StoreContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import {jwtDecode} from "jwt-decode"; // Fixed the import

const Login = ({ setShowLogin }) => {
    const { signup, isLoading, login, forgotPassword } = useAuthStore();
    const { setToken, setUserId, setUserName, setUserEmail, setCartItems, setIsLoggedIn } = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [forgotEmail, setForgotEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resetMessage, setResetMessage] = useState(""); // New state for reset message

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onForgotEmailChange = (event) => {
        setForgotEmail(event.target.value);
    };

    const handleLogout = () => {
        // Clear stored data on logout
        setToken(null);
        setUserId(null);
        setUserName(null);
        setUserEmail(null);
        setIsLoggedIn(false);
        localStorage.clear(); // Clear localStorage on logout
        toast.info("Session expired. Please log in again.");
        setShowLogin(true);
    };

    // Check if the token is expired
    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp * 1000 < Date.now(); // Check if expiration time is past
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isTokenExpired(token)) {
            handleLogout(); // Log out immediately if the token is expired
        }
    }, []);

    const onLogin = async (event) => {
        event.preventDefault();

        if (currState === "Sign Up") {
            try {
                await signup(data.email, data.password, data.name);
                toast.success("Account created! Please verify your email.");
                setShowLogin(false);
                navigate('/verify-email');
            } catch (error) {
                toast.error(error.message || "Error during sign-up");
            }
        } else if (currState === "Forgot Password") {
            try {
                const response = await forgotPassword(forgotEmail);
                if (response.data.success) {
                    toast.success("Password reset link sent to your email.");
                    setIsSubmitted(true);
                    setResetMessage("A password reset link has been sent to your email."); // Set reset message
                } else {
                    toast.error(response.data.message || "Failed to send password reset link");
                }
            } catch (error) {
                toast.error("Error sending password reset link");
                console.log(error);
            }
        } else {
            try {
                const response = await login(data.email, data.password);
                if (response.data.success) {
                    const token = response.data.token; // Extract token from response
                    setToken(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("userId", response.data.userId);
                    localStorage.setItem("userName", response.data.name);
                    localStorage.setItem("userEmail", response.data.email);
                    localStorage.setItem("cartItems", response.data.cartItems);

                    setCartItems(response.data.cartItems);
                    setUserId(response.data.userId);
                    setUserName(response.data.name);
                    setUserEmail(response.data.email);
                    setIsLoggedIn(true);

                    // Decode the token to check expiration
                    const decodedToken = jwtDecode(token);
                    const expirationTime = decodedToken.exp * 1000 - Date.now(); // Calculate time until expiration

                    if (expirationTime > 0) {
                        // Set a timeout to log the user out when the token expires
                        setTimeout(() => {
                            handleLogout();  // Call handleLogout function when the token expires
                        }, expirationTime);
                    } else {
                        handleLogout(); // Token is already expired, log the user out
                    }

                    toast.success("Logged in successfully!");
                    setShowLogin(false);
                    navigate('/');
                } else {
                    toast.error(response.data.message || "Login failed");
                }
            } catch (error) {
                toast.error('Something went wrong during login');
            }
        }
    };

    return (
        <div className='login'>
            <form onSubmit={onLogin} className='login-container'>
                <div className="login-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-inputs">
                    {currState === 'Sign Up' ? (
                        <>
                            <input
                                name='name'
                                onChange={onChangeHandler}
                                value={data.name}
                                type='text'
                                placeholder='Your name'
                                required
                            />
                            <input
                                name='email'
                                onChange={onChangeHandler}
                                value={data.email}
                                type='email'
                                placeholder='Your Email'
                                required
                            />
                            <input
                                name='password'
                                onChange={onChangeHandler}
                                value={data.password}
                                type='password'
                                placeholder='Enter your password'
                                required
                            />
                        </>
                    ) : currState === 'Forgot Password' ? (
                        <input
                            name='forgotEmail'
                            onChange={onForgotEmailChange}
                            value={forgotEmail}
                            type='email'
                            placeholder='Enter your Email for reset'
                            required
                        />
                    ) : (
                        <>
                            <input
                                name='email'
                                onChange={onChangeHandler}
                                value={data.email}
                                type='email'
                                placeholder='Your Email'
                                required
                            />
                            <input
                                name='password'
                                onChange={onChangeHandler}
                                value={data.password}
                                type='password'
                                placeholder='Enter your password'
                                required
                            />
                        </>
                    )}
                </div>
                <button type='submit' disabled={isLoading}>
                    {currState === 'Sign Up' ? (isLoading ? "Creating Account..." : "Create Account") :
                        currState === 'Forgot Password' ? "Send Reset Link" : "Login"}
                </button>
                {currState === 'Login' && (
                    <>
                        <p>Forgot your password? <span onClick={() => setCurrState("Forgot Password")}>Reset</span></p>
                        <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></p>
                    </>
                )}
                {currState === 'Forgot Password' && (
                    <p>Remembered your password? <span onClick={() => setCurrState("Login")}>Login</span></p>
                )}
                {currState === 'Sign Up' && (
                    <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></p>
                )}
                {isSubmitted && resetMessage && (
                    <div className='submitted-message'>
                        <p>{resetMessage}</p>
                    </div>
                )}
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
