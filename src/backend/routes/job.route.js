import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs,
} from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const jobRoutes = express.Router();

// Public routes
jobRoutes.get("/", getAllJobs);
jobRoutes.get("/:id", getJobById);

// Protected routes
jobRoutes.post("/", isAuthenticated, createJob);
jobRoutes.put("/:id", isAuthenticated, updateJob);
jobRoutes.delete("/:id", isAuthenticated, deleteJob);
jobRoutes.get("/employer/jobs", isAuthenticated, getEmployerJobs);

export default jobRoutes;
