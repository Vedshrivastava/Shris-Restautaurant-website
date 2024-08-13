// controllers/foodController.js
import Food from "../models/food.js";
import fs from 'fs';
import path from 'path';

// Add food item
const addFood = async (req, res) => {
    console.log('Request body:', req.body);

    const imageFilename = req.file ? req.file.filename : '';

    const food = new Food({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: imageFilename
    });

    try {
        await food.save();
        res.json({ success: true, message: 'Food Added' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching food list' });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    const { _id } = req.body;

    try {
        const food = await Food.findById(_id);

        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        // Delete the image from the server
        const imagePath = path.join('uploads', food.image);
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting image:', err);
        });

        // Delete the food item from the database
        await Food.findByIdAndDelete(_id);
        res.json({ success: true, message: 'Food Removed' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error removing food' });
    }
};

// Get reviews for a specific food item
const getReviewList = async (req, res) => {
    const { id } = req.params;

    try {
        const food = await Food.findById(id).populate('reviews'); // Populate reviews
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
