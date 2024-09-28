import React, { useEffect, useState, useContext } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Footer from './components/Footer';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import Verify from './pages/Verify';
import MyOrders from './pages/MyOrders';
import Item from './pages/Item';
import Success from './pages/Success';
import Email_verification from './pages/Email_verification';
import ResetPassword from './pages/ResetPassword';
import { useAuthStore } from './store/authStore';
import { StoreContext } from './context/StoreContext';

const ProtectedRoute = ({ children, setShowLogin }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { isLoggedIn } = useContext(StoreContext); // Get isLoggedIn from context
  
  // Logging authentication and verification states
  console.log("ProtectedRoute Rendered");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("User:", user);
  console.log("isLoggedIn:", isLoggedIn);

  // Check if the user is authenticated and verified
  if (!isAuthenticated) {
    console.log("User is not authenticated. Showing login dialog.");
    setShowLogin(true); // Show the login dialog
    return <Navigate to='/' replace />; // Redirect to the home page
  }

  // Check if the user is not verified
  if (!user.isVerified) {
    console.log("User is not verified. Redirecting to verification page.");
    return <Navigate to='/verify-email' replace />; // Redirect to verification page
  }

  if (!isLoggedIn) {
    console.log("User is not logged in. Redirecting to home page.");
    return <Navigate to='/' replace />;
  }

  console.log("User is authenticated and verified. Rendering children.");
  return children; // Render children if authenticated and verified
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Logging authenticated user state
  console.log("RedirectAuthenticatedUser Rendered");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("User:", user);

  if (isAuthenticated && user.isVerified) {
    console.log("Authenticated user detected. Redirecting to home page.");
    return <Navigate to='/' replace />;
  }
  
  console.log("User is not authenticated or not verified. Rendering children.");
  return children;
}

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <Login setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={
            <ProtectedRoute setShowLogin={setShowLogin}>
              <PlaceOrder />
            </ProtectedRoute>
          } />
          <Route path='/success' element={<Success />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/my-orders' element={
            <ProtectedRoute setShowLogin={setShowLogin}>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path='/item/:id' element={<Item />} />
          <Route path='/verify-email' element={
            <RedirectAuthenticatedUser>
              <Email_verification />
            </RedirectAuthenticatedUser>
          } />
            <Route path='/reset-password/:token' element={
              <ResetPassword setShowLogin={setShowLogin} />
          } />
        </Routes>

      </div>
      <Footer />
      <ToastContainer /> {/* Place ToastContainer here */}
    </>
  );
};

export default App;
