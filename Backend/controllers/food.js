import Food from "../models/food.js";
import cloudinary from 'cloudinary';
import fs from 'fs';

const addFood = async (req, res) => {
    console.log('Request body:', req.body);

    try {
        let imageUrl = '';

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'food_images'
            });
            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        const food = new Food({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: imageUrl
        });

        await food.save();
        res.json({ success: true, message: 'Food Added' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
};

const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching food list' });
    }
};

const removeFood = async (req, res) => {
    const { _id } = req.body;

    try {
        const food = await Food.findById(_id);

        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        if (food.image) {
            const publicId = food.image.split('/').pop().split('.')[0];
            await cloudinary.v2.uploader.destroy(`food_images/${publicId}`);
        }

        await Food.findByIdAndDelete(_id);
        res.json({ success: true, message: 'Food Removed' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error removing food' });
    }
};

const getReviewList = async (req, res) => {
    const { id } = req.params;

    try {
        const food = await Food.findById(id).populate('reviews'); 
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        res.json({ success: true, reviews: food.reviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};

export { addFood, listFood, removeFood, getReviewList };
