import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

// auth routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/logout", isAuthenticated, logout);
userRoutes.get("/me", isAuthenticated, getUserProfile);

export default userRoutes;
