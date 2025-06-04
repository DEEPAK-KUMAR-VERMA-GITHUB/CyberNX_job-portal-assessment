import express from "express";
import { login, register } from "../controllers/user.controller.js";

const userRoutes = express.Router();

// auth routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);

export default userRoutes;
