import express from "express";
import { registerAdmin,loginAdmin } from "../controllers/admin.js";

const admin = express.Router();

admin.post("/register-admin", registerAdmin);
admin.post("/login-admin", loginAdmin);

export default admin;
