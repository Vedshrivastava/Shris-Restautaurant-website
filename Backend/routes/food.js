import express from 'express'
import { addFood, getReviewList, listFood, removeFood } from '../controllers/food.js';
import multer from 'multer'
import { adminAuthMiddleware } from '../middlewares/auth.js';

const food = express.Router();

// for image processing

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

food.post('/add',adminAuthMiddleware ,upload.single("image"), addFood);

food.get('/admin-list', adminAuthMiddleware, listFood)

food.get('/list', listFood);

food.delete('/remove', adminAuthMiddleware, removeFood)

food.get('/reviews/:id', getReviewList)



export default food;