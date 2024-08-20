import express from "express";
import { registerAdmin } from "../controllers/admin.js";

const admin = express.Router();

user.post("/register-admin", registerAdmin);

export default admin;
