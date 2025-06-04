import jwt from "jsonwebtoken";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import UserModel from "../models/user.model.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      ErrorHandler.unauthorized("Please login to access this resource")
    );
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decodedData.id);
    next();
  } catch (error) {
    return next(ErrorHandler.unauthorized("Invalid token"));
  }
});
