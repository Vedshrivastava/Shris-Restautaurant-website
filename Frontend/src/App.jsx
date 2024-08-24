import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Footer from './components/Footer';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import Verify from './pages/Verify';
import MyOrders from './pages/MyOrders';
import Item from './pages/Item';
import Sucess from './pages/Sucess';

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
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/sucess' element={<Sucess />}/>
          <Route path='/verify' element={< Verify />}></Route>
          <Route path='/my-orders' element={< MyOrders />} ></Route>
          <Route path='/item/:id' element={<Item />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer /> {/* Place ToastContainer here */}
    </>
  );
};

export default App;
