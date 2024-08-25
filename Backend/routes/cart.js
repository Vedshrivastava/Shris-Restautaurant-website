import express from 'express'
import {addToCart, removeFromCart, getCart, updateCartQuantity} from '../controllers/cart.js'
import { signTokenForConsumer } from '../middlewares/index.js'

const cart = express.Router()

cart.post('/add', signTokenForConsumer, addToCart)
cart.delete('/remove', signTokenForConsumer, removeFromCart)
cart.get('/get', signTokenForConsumer, getCart)
cart.post('/update', signTokenForConsumer, updateCartQuantity)

export default cart;