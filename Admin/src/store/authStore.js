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
        try {
            const response = await axios.post(`http://localhost:4000/api/admin/register`, { email, password, name });
            const { user } = response.data;
            
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            
            set({ user, isAuthenticated: true, isLoading: false });
            console.log("Signup response :--->> ", response.data);

            return response;  // Return response data
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`http://localhost:4000/api/admin/login-admin`, { email, password });
            const { user } = response.data;

            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');

            set({ user, isAuthenticated: true, isLoading: false });
            console.log("Login response :--->> ", response.data);

            return response;  // Return response data
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`http://localhost:4000/api/user/verify-email`, { code });
            const { user } = response.data;
            
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            
            set({ user, isAuthenticated: true, isLoading: false });
            console.log("Email verification response :--->> ", response.data);

            return response;  // Return response data
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const { token } = useContext(StoreContext);
            const response = await axios.get(`http://localhost:4000/api/user/check-auth`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            const { user } = response.data;
    
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            
            set({ user, isAuthenticated: true, isCheckingAuth: false });
            console.log("CheckAuth response :--->> ", response.data);
    
            return response;  // Return response data
        } catch (error) {
    
            // Enhanced error handling
            const errorMessage = error.response?.data?.message || "An unexpected error occurred"; // Fallback message
    
            console.log("Error from auth :===>>>", error);
            set({ error: errorMessage, isCheckingAuth: false, isAuthenticated: false });
            return error;
        }
    },

    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`http://localhost:4000/api/user/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
            return response;
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`http://localhost:4000/api/user/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
            return response
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
    

    logout: () => {
        // Clear the local storage and reset the state
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        set({ user: null, isAuthenticated: false });
    }
}));
