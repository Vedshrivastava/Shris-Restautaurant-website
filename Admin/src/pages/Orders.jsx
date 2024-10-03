import React, { useEffect, useState } from 'react';
import '../styles/orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/admin_assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders (whether paid or unpaid)
  const fetchAllOrders = async () => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get(`${url}/api/order/list`, {
            headers: { Authorization: `Bearer ${token}` } // Add the Authorization header
        });

        if (response.data.success) {
            setOrders(response.data.data); // Set the orders if the response is successful
        } else {
            toast.error('Error fetching orders'); // Show error if response is not successful
        }
    } catch (error) {
        toast.error('Failed to fetch orders'); // Show general error
        console.error(error); // Log the error for debugging
    }
};


  // Update the status of an order
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + '/api/order/status', {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders(); // Refresh orders after status update
      }
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders(); // Fetch orders when component mounts
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  return `${item.name} x ${item.quantity}${idx === order.items.length - 1 ? '' : ', '}`;
                })}
              </p>
              <p className='order-item-name'>
                {order.address.firstName + ' ' + order.address.lastName}
              </p>
              <div className='order-item-address'>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city + ' ' + order.address.state + ' ' + order.address.country + ' ' + order.address.zipcode}
                </p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>

            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>
            <p style={{ color: order.payment ? 'green' : 'red' }}>
             {order.payment ? 'Paid' : 'Pending'}
            </p>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
