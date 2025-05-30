// Success response
exports.successResponse = (
  res,
  data,
  message = "Request was successful",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response
exports.errorResponse = (res, message, statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
