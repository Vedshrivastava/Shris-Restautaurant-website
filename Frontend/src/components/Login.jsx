import React, { useState, useContext } from 'react';
import '../styles/Login.css';
import { assets } from '../assets/frontend_assets/assets';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom'; 

const Login = ({ setShowLogin }) => {
    const { url, setToken, setUserId, setUserName, setUserEmail, setCartItems } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate(); 

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;

        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, data);
            console.log("Login Response:", response.data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId); 
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem("userEmail", response.data.email);
                localStorage.setItem("cartItems", response.data.cartItems);
                setCartItems(response.data.cartItems);
                setUserId(response.data.userId); 
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                toast.success(response.data.message);

                setTimeout(() => {
                    setShowLogin(false);
                    navigate('/'); 
                }, 1000); 
            } else {
                toast.error(response.data.message); 
            }
        } catch (error) {
            toast.error('Something went wrong'); 
        }
    };

    return (
        <div className='login'>
            <form onSubmit={onLogin} className='login-container'>
                <div className="login-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-inputs">
                    {currState === 'Login' ? null : <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your Email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Enter your password' required />
                </div>
                <button type='submit'>{currState === 'Sign Up' ? "Create Account" : "Login"}</button>
                <div className="login-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to all the terms and conditions </p>
                </div>
                {currState === 'Login'
                    ? <p>Create a new Account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an Account? <span onClick={() => setCurrState("Login")}>Login here</span></p>}
            </form>
            <ToastContainer /> 
        </div>
    );
};

export default Login;
