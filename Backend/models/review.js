import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    comment: {type:String, require:true},
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Object,
        ref: "user",
    }
})


const reviewModel = mongoose.models.reviews || mongoose.model("review", reviewSchema)
export default reviewModel;

