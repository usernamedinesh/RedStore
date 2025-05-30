const { errorResponse } = require("../utils/response");

// This middleware handles undefined routes
function notFoundHandler(req, res, next) {
  const errorMessage = `Route ${req.originalUrl} not found`;

  // Log the error for debugging purposes
  console.error(errorMessage);

  // return res.status(404).json({
  //   success: false,
  //   message: "Route not found",
  //   details: {
  //     attemptedRoute: req.originalUrl,
  //     method: req.method,
  //   },
  // });

  // Use the errorResponse utility function for consistency
  errorResponse(res, "Route not found", 404, {
    attemptedRoute: req.originalUrl,
    method: req.method,
  });
}

module.exports = notFoundHandler;
