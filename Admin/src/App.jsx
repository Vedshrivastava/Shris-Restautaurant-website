import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Add_Category from './pages/Add-Category';
import List_Categories from './pages/List-Categories';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import your ProtectedRoute component
import Email_verification from './components/Email_verification'
import {Navigate} from 'react-router-dom';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const url = "http://localhost:4000";

  const RedirectAuthenticatedUser = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || false
    // Logging authenticated user state
    console.log("RedirectAuthenticatedUser Rendered");
    console.log("isAuthenticated:", isAuthenticated);
  
    if (isAuthenticated) {
      console.log("Authenticated user detected. Redirecting to home page.");
      return <Navigate to='/' replace />;
    }
    
    console.log("User is not authenticated or not verified. Rendering children.");
    return children;
  }

  return (
    <div>
      {showLogin && <Login setShowLogin={setShowLogin} />}
      <ToastContainer />
      <Navbar setShowLogin={setShowLogin} />
      <div className="app-contents">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route
              path='/add'
              element={
                <ProtectedRoute setShowLogin={setShowLogin}>
                  <Add url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/add-category'
              element={
                <ProtectedRoute setShowLogin={setShowLogin}>
                  <Add_Category url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/list'
              element={
                <ProtectedRoute setShowLogin={setShowLogin}>
                  <List url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/get-categories'
              element={
                <ProtectedRoute setShowLogin={setShowLogin}>
                  <List_Categories url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/orders'
              element={
                <ProtectedRoute setShowLogin={setShowLogin}>
                  <Orders url={url} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
