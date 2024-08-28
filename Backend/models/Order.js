import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId},
    items: { type: Array },
    amount: { type: Number},
    address: { type: Object },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
});

const orderModel = mongoose.models.orders || mongoose.model("order", orderSchema);
export default orderModel;
