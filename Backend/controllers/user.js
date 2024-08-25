import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import {
  signTokenForConsumer,
  signTokenForAdmin,
} from "../middlewares/index.js";

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ success: false, message: "The user does not exist" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Wrong password" });
      }
  
      let tokenData = {
        id: user._id,
        email: email,
        name: user.name,
      };
  
      if (user.role === "USER") {
        const token = await signTokenForConsumer(tokenData);
        return res.status(200).json({
          success: true,
          token,
          userId: user._id,
          name: user.name, // Optionally include the user's name
          email: user.email, // Optionally include the user's email
          message: "Logged in successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Some Internal Error Occurred",
      });
    }
  };
  

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a valid email",
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

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPass,
    });

    const user = await newUser.save();
   

    return res.json({
      success: true,
      userId: user._id, // Include userId in the response
      message: "Account Created",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Some Internal Error Occurred",
    });
  }
};

export { loginUser, registerUser };
