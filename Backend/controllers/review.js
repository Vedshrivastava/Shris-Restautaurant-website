import userModel from "../models/user.js";
import reviewModel from "../models/review.js";
import foodModel from "../models/food.js";
import mongoose from 'mongoose';

// Add a Review
const addReview = async (req, res) => {
    try {
        const { username, userid, foodId, comment, rating } = req.body;

        console.log("Received userId:", userid);  // Debugging: Log userId
        console.log("Received foodId:", foodId);  // Debugging: Log foodId
        console.log("Received username:", username);  // Debugging: Log username

        // Convert IDs to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userid);
        const foodObjectId = new mongoose.Types.ObjectId(foodId);

        // Fetch the user and food item from the database
        const user = await userModel.findById(userObjectId);
        const foodItem = await foodModel.findById(foodObjectId);

        console.log("User:", user);  // Debugging: Log the user document
        console.log("Food item:", foodItem);  // Debugging: Log the food item document

        if (!user) {
            console.error("User not found:", userid);  // Log detailed error
            return res.status(404).json({ message: "User not found" });
        }

        if (!foodItem) {
            console.error("Food item not found:", foodId);  // Log detailed error
            return res.status(404).json({ message: "Food item not found" });
        }

        // Create and save the review
        const review = new reviewModel({
            comment,
            rating,
            author: userObjectId,  // Storing the ObjectId reference
            by: username  // Directly using the username string
        });

        console.log("Saving review:", review);  // Debugging: Log the review to be saved
        await review.save();

        // Add the review to the food item
        foodItem.reviews.push(review._id);
        console.log("Saving food item with new review:", foodItem);  // Debugging: Log the food item before saving
        await foodItem.save();

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Error in addReview:", error);  // Log detailed error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Edit a Review
const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment, rating } = req.body;

        // Find the review by ID
        const review = await reviewModel.findById(reviewId);
        
        // Check if the review exists
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if the current user is authorized to edit this review
        if (review.author.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to edit this review" });
        }

        // Update the review fields
        if (comment) review.comment = comment;
        if (rating) review.rating = rating;

        // Save the updated review
        await review.save();

        // Respond with the updated review
        res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error('Error updating review:', error);  // Improved logging
        res.status(500).json({ message: "Server error" });
    }
};


// Delete a Review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Access userId directly from req
        if (review.author.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this review" });
        }

        await reviewModel.findByIdAndDelete(reviewId);

        const foodItem = await foodModel.findOne({ reviews: reviewId });
        if (foodItem) {
            foodItem.reviews = foodItem.reviews.filter(id => id.toString() !== reviewId);
            await foodItem.save();
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Get Reviews for a Food Item
const getReviews = async (req, res) => {
    try {
        const { foodId } = req.params;

        const foodItem = await foodModel.findById(foodId).populate('reviews');

        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json({ reviews: foodItem.reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export { addReview, editReview, deleteReview, getReviews };
