const rate_limiter = require("express-rate-limit");
const CustomError = require("../utils/customError");
const { errorResponse } = require("../utils/response");
const rateLimiter = rate_limiter({
  window: 15 * 60 * 1000, //15 minutes
  max: 100, // Limit of each IP 100 request per window
  skipSuccessfulRequests: true, // Skip counting successful requests

  keyGenerator: (req) => {
    const clientIP = req.ip;
    if (!clientIP) {
      throw new CustomError("Unable to determine IP");
    }
    return clientIP;
  },

  handler: (req, res, next) => {
    errorResponse(
      res,
      { message: "Too many requests, please try again later." },
      429,
    );
  },
});

module.exports = rateLimiter;
