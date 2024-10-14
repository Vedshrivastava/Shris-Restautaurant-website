import React, { useState, useContext, useEffect } from 'react';
import '../styles/Login.css';
import { assets_frontend } from '../assets/frontend_assets/assets';
import { StoreContext } from '../context/StoreContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { jwtDecode } from 'jwt-decode';

const Login = ({ setShowLogin }) => {
    const { isLoading, login, forgotPassword } = useAuthStore();
    const { setToken, setUserId, setUserName, setUserEmail, setIsLoggedIn } = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({ email: "", password: "" });
    const [forgotEmail, setForgotEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resetMessage, setResetMessage] = useState(""); 

    const navigate = useNavigate();

    useEffect(() => {
        // Check for token validity on component mount
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const isExpired = decodedToken.exp * 1000 < Date.now();
            if (isExpired) {
                handleLogout();
            }
        }
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onForgotEmailChange = (event) => {
        setForgotEmail(event.target.value);
    };

    const onLogin = async (event) => {
        event.preventDefault();

        if (currState === "Forgot Password") {
            // Forgot Password Logic
            // ...
        } else {
            // Login Logic
            try {
                const response = await login(data.email, data.password);
                if (response.data.success) {
                    if (response.data.role !== "ADMIN") {
                        toast.error("You do not have permission to log in.");
                        return; 
                    }

                    const token = response.data.token;
                    setToken(token);
                    localStorage.setItem("token", token);

                    const decodedToken = jwtDecode(token);
                    localStorage.setItem("userId", decodedToken.id);
                    localStorage.setItem("userName", decodedToken.name);
                    localStorage.setItem("userEmail", decodedToken.email);

                    setUserId(decodedToken.id);
                    setUserName(decodedToken.name);
                    setUserEmail(decodedToken.email);
                    setIsLoggedIn(true);

                    toast.success("Logged in successfully!");
                    setShowLogin(false);
                    navigate('/');

                    const expirationTime = decodedToken.exp * 1000;
                    const logoutTime = expirationTime - Date.now();

                    if (logoutTime > 0) {
                        setTimeout(() => {
                            handleLogout();
                        }, logoutTime);
                    }
                } else {
                    toast.error(response.data.message || "Login failed");
                }
            } catch (error) {
                console.log(error);
                toast.error('Something went wrong during login');
            }
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        toast.info("You have been logged out due to inactivity.");
        navigate('/login');
    };

    return (
        <div className='login'>
            <form onSubmit={onLogin} className='login-container'>
                <div className="login-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets_frontend.cross_icon} alt="Close" />
                </div>
                <div className="login-inputs">
                    {currState === 'Forgot Password' ? (
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
                    {currState === 'Forgot Password' ? "Send Reset Link" : "Login"}
                </button>
                {currState === 'Login' && (
                    <p>Forgot your password? <span onClick={() => setCurrState("Forgot Password")}>Reset</span></p>
                )}
                {currState === 'Forgot Password' && (
                    <p>Remembered your password? <span onClick={() => setCurrState("Login")}>Login</span></p>
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
