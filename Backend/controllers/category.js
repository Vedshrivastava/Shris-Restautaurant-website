import Category from "../models/category.js";
import fs from 'fs'

const addCategory = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const imageFilename = req.file ? req.file.filename : '';

    const category = new Category({
        name: req.body.name,
        image: imageFilename
    });

    try {
        await category.save();
        res.json({ success: true, message: 'Category Added' });
    } catch (error) {
        console.error('Error saving category:', error);
        res.json({ success: false, message: 'Error adding category' });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json({ success: true, categories });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.body._id)
        fs.unlink(`uploads/${category.image}`, () => {})

        await Category.findByIdAndDelete(req.body._id)
        res.json({success: true, message: 'Food Removed'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: 'some error occured'})
    }
}

export { addCategory, listCategories, removeCategory };
