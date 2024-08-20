import adminModel from "../models/admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import adminModel from "../models/admin";
import { signTokenForConsumer, signTokenForAdmin } from "../middlewares/index.js";

const registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const exist = await adminModel.findOne({ email });
    if (exist) {
      return res.json({
        success: true,
        status: 400,
        message: "Admin already exists",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "The password must be at least 8 digits long.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newAdmin = new adminModel({
      name: name,
      email: email,
      password: hashedPass,
    });
    const admin = await newAdmin.save();
    return res.json({
      success: true,
      userId: user._id, // Include userId in the response
      message: "Admin Created Successfullyy",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Some Internal Error Occured" });
  }
};
export { registerAdmin };
