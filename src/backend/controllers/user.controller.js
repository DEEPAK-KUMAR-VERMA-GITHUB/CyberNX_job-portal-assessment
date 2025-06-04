import UserModel from "../models/user.model.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password || !role) {
    return next(ErrorHandler.badRequest("Please fill all fields"));
  }

  // check if user already exists with this email
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return next(
      ErrorHandler.alreadyExists("User already exists with this email")
    );
  }

  if (role === "employer" && !company) {
    return next(ErrorHandler.badRequest("Please fill all fields"));
  }

  // create new user
  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    company,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(ErrorHandler.badRequest("Please fill all fields"));
  }

  // check if user exists with this email
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(ErrorHandler.notFound("User not found"));
  }

  // check if password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(ErrorHandler.badRequest("Invalid credentials"));
  }

  // generate token
  const token = user.getJwtToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  return res.status(200).cookie("token", token, cookieOptions).json({
    success: true,
    message: "User logged in successfully",
    user,
    token,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);

  return res.status(200).json({
    success: true,
    user,
  });
});
