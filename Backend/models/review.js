import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    comment: { 
        type: String, 
        required: true 
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,  // Storing the reference to the user as ObjectId
        ref: "User",  // Reference to the User model
        required: true
    },
    by: {
        type: String,  // Storing the username as a string
        required: true
    }
});

const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;
