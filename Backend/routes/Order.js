import express from 'express'
import authMiddleware from '../middlewares/auth.js';
import { placeOrder, verifyOrders, userOrders, listOrders, updateStatus } from '../controllers/Order.js';

const order = express.Router()

order.post('/place', authMiddleware, placeOrder);

order.post('/verify', verifyOrders)

order.post('/user-orders', authMiddleware, userOrders)

order.get('/list', listOrders)

order.post('/status', updateStatus)

export default order;