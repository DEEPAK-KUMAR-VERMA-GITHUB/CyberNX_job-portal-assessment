import express from "express";
import { register } from "../controllers/user.controller.js";

const userRoutes = express.Router();

// auth routes
userRoutes.post("/register", register);

export default userRoutes;
