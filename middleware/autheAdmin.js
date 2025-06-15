const jwt = require("jsonwebtoken");
const env = require("../config/envConfig");
const { successResponse } = require("../utils/response");

const authenticateAdminWIthJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  if (!authHeader) {
    return successResponse(res, null, "No auth token", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return successResponse(res, null, "Malformed auth token", 401);
  }

  // here need to decode the hash token
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err);
      return successResponse(res, null, "Unauthorized", 401);
    } else {
      req.user = decoded;
      return next();
    }
  });
};

module.exports = { authenticateAdminWIthJWT };
