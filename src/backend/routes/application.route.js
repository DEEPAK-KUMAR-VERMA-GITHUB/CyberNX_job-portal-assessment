import express from "express";
import {
  applyForJob,
  getUserApplications,
  getJobApplications,
} from "../controllers/application.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const applicationRoutes = express.Router();

// Apply for a job
applicationRoutes.post("/apply", isAuthenticated, applyForJob);

// Get user's applications
applicationRoutes.get("/user", isAuthenticated, getUserApplications);

// Get job applications (for employers)
applicationRoutes.get("/job/:jobId", isAuthenticated, getJobApplications);

export default applicationRoutes;
