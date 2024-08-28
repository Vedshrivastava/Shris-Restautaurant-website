import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
      required: true,
    },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("User", userSchema);
export default userModel;
