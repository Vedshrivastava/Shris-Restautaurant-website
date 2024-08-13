import express from 'express';
import multer from 'multer';
import { addCategory, listCategories, removeCategory } from '../controllers/category.js';

const category = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage });

category.post('/add-category', upload.single('image'), addCategory);
category.get('/get-categories', listCategories);
category.delete('/remove', removeCategory)

export default category;
