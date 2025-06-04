class ErrorHandler extends Error {
  statusCode;
  message;
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static alreadyExists(message) {
    return new ErrorHandler(409, message);
  }
  static wrongCredentials(message = "Username or password is incorrect") {
    return new ErrorHandler(401, message);
  }
  static unauthenticated(message = "Unauthenticated") {
    return new ErrorHandler(401, message);
  }
  static unauthorized(message = "Unauthorized") {
    return new ErrorHandler(403, message);
  }
  static notFound(message = "Not found") {
    return new ErrorHandler(404, message);
  }
  static serverError(message = "Internal server error") {
    return new ErrorHandler(500, message);
  }
  static badRequest(message = "Bad request") {
    return new ErrorHandler(400, message);
  }
  static forbidden(message = "Forbidden") {
    return new ErrorHandler(403, message);
  }
  static tooManyRequests(message = "Too many requests") {
    return new ErrorHandler(429, message);
  }
  static serviceUnavailable(message = "Service unavailable") {
    return new ErrorHandler(503, message);
  }
  static gatewayTimeout(message = "Gateway timeout") {
    return new ErrorHandler(504, message);
  }
  static notAcceptable(message = "Not acceptable") {
    return new ErrorHandler(406, message);
  }
  static validationError(message = "Validation error") {
    return new ErrorHandler(422, message);
  }
}

export default ErrorHandler;
