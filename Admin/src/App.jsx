import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Add_Category from './pages/Add-Category'
import List_Categories from './pages/List-Categories'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer, toast} from 'react-toastify'

const App = () => {

  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <div className="app-contents">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path='/add' element={<Add url={url} /> } />
            <Route path='/add-category' element={<Add_Category url={url} /> } />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/get-categories' element={<List_Categories url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
