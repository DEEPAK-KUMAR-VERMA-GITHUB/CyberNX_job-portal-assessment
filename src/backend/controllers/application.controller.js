import ApplicationModel from "../models/application.model.js";
import JobModel from "../models/job.model.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const applyForJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId, resume, coverLetter } = req.body;
  // check if user is a job seeker
  if (req.user.role !== "jobseeker") {
    return next(
      ErrorHandler.unauthorized("Only job seekers can apply for jobs")
    );
  }

  // check if job exists
  const job = await JobModel.findById(jobId);
  if (!job) {
    return next(ErrorHandler.notFound("Job not found"));
  }

  // check if job is active
  if (job.status !== "active") {
    return next(
      ErrorHandler.badRequest("This job is no longer accepting applications")
    );
  }

  // Check if user has already applied
  const existingApplication = await ApplicationModel.findOne({
    jobId,
    userId: req.user.id,
  });

  if (existingApplication) {
    return next(
      ErrorHandler.badRequest("You have already applied for this job")
    );
  }

  const application = await ApplicationModel.create({
    jobId,
    userId: req.user.id,
    resume,
    coverLetter,
  });

  // add applicant to job's applicants array
  await JobModel.findByIdAndUpdate(jobId, {
    $push: { applicants: req.user.id },
  });

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
});

// Get user's applications
export const getUserApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await ApplicationModel.find({ userId: req.user.id })
    .populate("jobId", "title company location type salary")
    .sort({ appliedDate: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

// Get job applications (for employers)
export const getJobApplications = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;

  // Check if job exists and belongs to the employer
  const job = await JobModel.findById(jobId);

  if (!job) {
    return next(ErrorHandler.notFound("Job not found"));
  }

  if (job.employer.toString() !== req.user.id) {
    return next(
      ErrorHandler.unauthorized(
        "You can only view applications for your own jobs"
      )
    );
  }

  const applications = await ApplicationModel.findById(jobId)
    .populate("userId", "name email")
    .sort({ appliedDate: -1 });

  return res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});
