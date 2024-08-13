import express from "express"
import cors from "cors"
import {connectDB} from './config/db.js'
import 'dotenv/config.js'
import food from "./routes/food.js";
import user from "./routes/user.js";
import cart from "./routes/cart.js";
import category from "./routes/category.js";
import order from "./routes/Order.js";
import review from "./routes/review.js";

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

connectDB(process.env.MONGO_URI)
console.log('JWT_SECRET:', process.env.JWT_SECRET);

app.use('/api/food', food);
app.use('/api/user', user);
app.use('/api/cart', cart);
app.use('/api/order', order);
app.use('/api/category', category);
app.use('/api/review', review)
app.use('/images', express.static('uploads'));

  

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`server started on http://localhost:${port}`)
})