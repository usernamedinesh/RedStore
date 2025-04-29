// middlewares/errorHandler.js
const { errorResponse } = require("../utils/response");

function errorHandler(err, req, res, next) {
  console.error(err); // Log full error (for dev/debugging)

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.code === "P2002") {
    // Prisma unique constraint
    statusCode = 400;
    message = `${err.meta.target} already exists.`;
  }

  // Send error response using the utility
  errorResponse(res, message, statusCode, err);
}

module.exports = errorHandler;
