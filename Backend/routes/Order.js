import express from 'express'
import authMiddleware from '../middlewares/auth.js';
import { userOrders, listOrders, phonepeOrder, status } from '../controllers/Order.js';

const order = express.Router()

order.post('/user-orders', authMiddleware, userOrders)

order.get('/list', listOrders)

order.post('/order', phonepeOrder)

order.post('/status', status)

export default order;