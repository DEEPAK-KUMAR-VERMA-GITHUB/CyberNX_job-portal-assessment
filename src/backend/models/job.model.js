import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [3, "Job title must be at least 3 characters long"],
      maxlength: [100, "Job title must be less than 100 characters long"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: ["full-time", "part-time", "contract", "internship", "remote"],
        message:
          "Job type must be one of: full-time, part-time, contract, internship, remote",
      },
    },
    salary: {
      type: String,
      required: [true, "Salary range is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [10, "Job description must be at least 10 characters long"],
    },
    requirements: {
      type: [String],
      required: [true, "Job requirements are required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one job requirement is required",
      },
    },
    category: {
      type: String,
      required: [true, "Job category is required"],
      trim: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employer is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "closed"],
        message: "Status must be either active or closed",
      },
      default: "active",
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;
