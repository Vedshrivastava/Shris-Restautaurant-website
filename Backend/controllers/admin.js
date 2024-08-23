import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signTokenForAdmin } from "../middlewares/index.js";

const registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({
        success: true,
        status: 400,
        message: "Admin already exists with provided email",
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
    const newAdmin = new userModel({
      name: name,
      email: email,
      password: hashedPass,
      role: "ADMIN",
    });
    const admin = await newAdmin.save();
    return res.json({
      status: 500,
      success: true,
      userId: admin._id, // Include userId in the response
      message: "Admin Created Successfullyy",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Some Internal Error Occured" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await userModel.findOne({ email });
    if (!exist) {
      return res.send({
        status: 400,
        success: false,
        message: "Admin not exist with provided email",
      });
    }
    const isMatch = bcrypt.compare(password, exist.password);
    if (!isMatch) {
      return res.send({
        status: 400,
        success: false,
        message: "Password does not match",
      });
    }
    let tokenData = {
      id: exist._id,
      name: exist.name,
      email: exist.email,
    };
    console.log(tokenData)

    if (exist.role == "ADMIN") {
      const token = await signTokenForAdmin(tokenData);
      if (token) {
        return res.send({
          status: 500,
          success: true,
          token,
          message: "Logged in successfully",
        });
      } else {
        return res.send({
          success: false,
          message: "Some error occurred while generating token",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: 500,
      success: false,
      message: "Some internal error occurred",
    });
  }
};

export { registerAdmin, loginAdmin };
