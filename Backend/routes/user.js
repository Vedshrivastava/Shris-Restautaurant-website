import express from 'express'
import { loginUser, registerUser } from '../controllers/user.js'

const user = express.Router();

user.post('/register', registerUser);
user.post('/login', loginUser)

export default user;