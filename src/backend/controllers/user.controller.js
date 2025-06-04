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
