import ErrorHandler from "../utils/ErrorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("Error : ", err);

  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof ErrorHandler) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // handle mongoose validation errors
  else if (err.name === "ValidationError") {
    statusCode = err.statusCode || 400;
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message
    );
    message = validationErrors.join(", ");
  }

  // handle mongoose cast errors (invalid objectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  }

  // handle mongoose duplicate key errors
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}`;
  }

  const response = {
    success: false,
    message,
  };

  // stack trace in development environment
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
