import React, { useEffect, useState, useContext } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Footer from './components/Footer';
import Login from './components/Login';
import { Toaster, toast } from 'react-hot-toast'; 
import Verify from './pages/Verify';
import MyOrders from './pages/MyOrders';
import Item from './pages/Item';
import Success from './pages/Success';
import Email_verification from './pages/Email_verification';
import ResetPassword from './pages/ResetPassword';
import Search from './components/Search';
import { useAuthStore } from './store/authStore';
import { StoreContext } from './context/StoreContext';



const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  const { isLoggedIn } = useContext(StoreContext);
  const [redirectPath, setRedirectPath] = useState(null); // State to handle redirect path

  useEffect(() => {
    if (!user.isVerified) {
      toast.error("Email is not verified");
      setRedirectPath('/verify-email'); // Set the redirect path after showing toast
    } else if (!isLoggedIn) {
      toast.error("User not logged in");
      setRedirectPath('/'); // Set the redirect path after showing toast
    }
  }, [user, isLoggedIn]); // Only runs when `user` or `isLoggedIn` changes

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children; // Render the protected content if no redirect is needed
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

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
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
    {showSearch && <Search setShowSearch={setShowSearch} />}
      {showLogin && <Login setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} setShowSearch={setShowSearch}/>
        <Routes>
          <Route path='/' element={<Home setShowSearch={setShowSearch} />} />
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
      <Toaster />
    </>
  );
};

export default App;
