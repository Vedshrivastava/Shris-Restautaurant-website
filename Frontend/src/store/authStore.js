import { create } from "zustand";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email, password, name) => {
        set({
            isLoading: true,
            error: null
        });
        console.log("Signup isLoading: true");

        try {
            const response = await axios.post(`http://localhost:4000/api/user/register`, { email, password, name });
            const { user } = response.data;
            
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ user, isAuthenticated: true, isLoading: false });
            console.log("Signup response :--->> ", response.data);
            console.log("Signup isLoading: false");

            return response;  // Return response data
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            console.log("Signup isLoading: false");
            throw error;
        }
    },

    login: async (email, password) => {
        // Clear any existing user data in localStorage
        localStorage.removeItem('user');
        
        set({ isLoading: true, error: null });
        console.log("Login isLoading: true, user removed from localStorage");
    
        try {
            const response = await axios.post(`http://localhost:4000/api/user/login`, { email, password });
            const { user } = response.data;
    
            // Save user data in localStorage after successful login
            localStorage.setItem('user', JSON.stringify(user));
    
            set({ user, isAuthenticated: true, isLoading: false });
            console.log("Login response :--->> ", response.data);
            console.log("Login isLoading: false");
    
            return response;  // Return response data
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            console.log("Login isLoading: false");
            throw error;
        }
    },
    

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        console.log("Verify Email isLoading: true");

        try {
            const response = await axios.post(`http://localhost:4000/api/user/verify-email`, { code });
            const { user } = response.data;
            
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ user, isAuthenticated: true, isLoading: false });
            console.log("Email verification response :--->> ", response.data);
            console.log("Verify Email isLoading: false");

            return response;  // Return response data
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            console.log("Verify Email isLoading: false");
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        console.log("CheckAuth isCheckingAuth: true");

        try {
            const { token } = useContext(StoreContext);
            const response = await axios.get(`http://localhost:4000/api/user/check-auth`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            const { user } = response.data;
    
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ user, isAuthenticated: true, isCheckingAuth: false });
            console.log("CheckAuth response :--->> ", response.data);
            console.log("CheckAuth isCheckingAuth: false");

            return response;  // Return response data
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            set({ error: errorMessage, isCheckingAuth: false, isAuthenticated: false });
            console.log("CheckAuth isCheckingAuth: false");
            throw error;
        }
    },

    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		console.log("ForgotPassword isLoading: true");

		try {
			const response = await axios.post(`http://localhost:4000/api/user/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
            console.log("ForgotPassword isLoading: false");
            return response;
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			console.log("ForgotPassword isLoading: false");
			throw error;
		}
	},

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        console.log("ResetPassword isLoading: true");

        try {
            const response = await axios.post(`http://localhost:4000/api/user/reset-password/${token}`, { password });
            set({ message: response.data.message });
            console.log("ResetPassword response :--->> ", response.data);
            return response;
        } catch (error) {
            set({
                error: error.response.data.message || "Error resetting password",
            });
            console.log("ResetPassword error: ", error);
            throw error;
        } finally {
            set({ isLoading: false });
            console.log("ResetPassword isLoading: false");
        }
    },
}));
