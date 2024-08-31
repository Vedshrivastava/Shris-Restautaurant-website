import React, { useContext, useEffect, useState } from 'react';
import '../styles/myorders.css';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { assets } from '../assets/frontend_assets/assets';

const MyOrders = () => {
    const [data, setData] = useState([]);
    const { url, token } = useContext(StoreContext);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/user-orders`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className='container'>
                {data.map((order) => (
                    <div className='my-orders-order' key={order._id}>
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <p>
                            {order.items.map((item, index) => (
                                <span key={index}>
                                    {item.name} x {item.quantity}
                                    {index !== order.items.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p>₹{order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p>
                            <span>&#x25cf;</span> <b>{order.status}</b>
                        </p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
