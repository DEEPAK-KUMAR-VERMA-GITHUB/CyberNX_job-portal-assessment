import JobModel from "../models/job.model.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Create a new job
export const createJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements,
    category,
  } = req.body;

  // Check if user is an employer
  if (req.user.role !== "employer") {
    return next(ErrorHandler.unauthorized("Only employers can post jobs"));
  }

  // check if job is already posted by the user
  const jobExists = await JobModel.findOne({
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements,
    category,
    employer: req.user.id,
  });

  // Create job
  const job = await JobModel.create({
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements,
    category,
    employer: req.user.id,
  });

  return res.status(201).json({
    success: true,
    message: "Job created successfully",
    job,
  });
});

// Get all jobs with filters
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { category, type, location, search } = req.query;

  // Build query
  const query = {};

  // Add filters if provided
  if (category) query.category = category;
  if (type) query.type = type;
  if (location) query.location = { $regex: location, $options: "i" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  // Only show active jobs
  query.status = "active";

  // Execute query
  const jobs = await JobModel.find(query)
    .sort({ postedDate: -1 })
    .populate("employer", "name company");

  return res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});

// Get job by ID
export const getJobById = catchAsyncErrors(async (req, res, next) => {
  const job = await JobModel.findById(req.params.id).populate(
    "employer",
    "name company email"
  );

  if (!job) {
    return next(ErrorHandler.notFound("Job not found"));
  }

  res.status(200).json({
    success: true,
    job,
  });
});

// Update job
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  let job = await JobModel.findById(req.params.id);

  if (!job) {
    return next(ErrorHandler.notFound("Job not found"));
  }

  // Check if user is the employer who posted the job
  if (job.employer.toString() !== req.user.id && req.user.role !== "employer") {
    return next(
      ErrorHandler.unauthorized("You can only update your own job listings")
    );
  }

  // Update job
  job = await JobModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    job,
  });
});

// Delete job
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const job = await JobModel.findById(req.params.id);

  if (!job) {
    return next(ErrorHandler.notFound("Job not found"));
  }

  // Check if user is the employer who posted the job
  if (job.employer.toString() !== req.user.id && req.user.role !== "employer") {
    return next(
      ErrorHandler.unauthorized("You can only delete your own job listings")
    );
  }

  // Delete job
  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

// Get employer's jobs
export const getEmployerJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await JobModel.find({ employer: req.user.id }).sort({
    postedDate: -1,
  });

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});
