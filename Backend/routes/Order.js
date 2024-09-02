import express from 'express'
import authMiddleware from '../middlewares/auth.js';
import { placeOrder, stripeWebhook, userOrders, listOrders, updateStatus } from '../controllers/Order.js';

const order = express.Router()

order.post('/place', authMiddleware, placeOrder);

order.post('/verify', stripeWebhook)

order.post('/user-orders', authMiddleware, userOrders)

order.get('/list', listOrders)

order.post('/status', updateStatus)

export default order;