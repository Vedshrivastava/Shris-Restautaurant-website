import express from 'express'
import {signTokenForConsumer} from '../middlewares/index.js'
import { placeOrder, verifyOrders, userOrders, listOrders, updateStatus } from '../controllers/Order.js';

const order = express.Router()

order.post('/place',placeOrder);

order.post('/verify', verifyOrders)

order.post('/user-orders', signTokenForConsumer, userOrders)

order.get('/list', listOrders)

order.post('/status', updateStatus)

export default order;