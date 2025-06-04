import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job Id is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    resume: {
      type: String,
      required: [true, "Resume is required"],
    },
    coverLetter: {
      type: String,
      required: [true, "Cover Letter is required"],
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const ApplicationModel = mongoose.model("Application", applicationSchema);
export default ApplicationModel;
