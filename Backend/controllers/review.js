import userModel from "../models/user.js";
import reviewModel from "../models/review.js";
import foodModel from "../models/food.js";

// Add a Review
const addReview = async (req, res) => {
    try {
        const { userId, foodId, comment, rating } = req.body;

        const user = await userModel.findById(userId);
        const foodItem = await foodModel.findById(foodId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
 
        // Create a new review
        const review = new reviewModel({
            comment,
            rating,
            author: userId
        });

        await review.save();

        // Add the review to the food item
        foodItem.reviews.push(review._id);
        await foodItem.save();

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Edit a Review
const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment, rating } = req.body;

        const review = await reviewModel.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.author.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to edit this review" });
        }

        review.comment = comment || review.comment;
        review.rating = rating || review.rating;

        await review.save();

        res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error(error);
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
