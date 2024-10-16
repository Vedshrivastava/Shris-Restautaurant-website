import express from 'express'
import {adminAuthMiddleware, authMiddleware, managerAuthMiddleware} from '../middlewares/auth.js';
import { userOrders, listOrders, phonepeOrder, codOrder, updateStatus } from '../controllers/Order.js';

const order = express.Router()

order.post('/user-orders', authMiddleware, userOrders)

order.get('/list', [managerAuthMiddleware], listOrders)

order.post('/order', phonepeOrder)

order.post('/status', adminAuthMiddleware, updateStatus)

order.post('/cod', codOrder)

export default order;