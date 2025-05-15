const jwt = require("jsonwebtoken");
const env = require("../config/envConfig");
const crypto = require("crypto");

/**
 * Generate a JWT token
 * @param {Object} user - The user object (usually from the database)
 * @returns {string} - The generated JWT token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Sign the payload with a secret key and an expiration time (optional)
  const token = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // Token expires in 15Minutes
  });

  return token;
};

/**
 * Generate a refresh token
 * @param {Object} user - The user object (usually from the database)
 * @returns {string} - The generated refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Sign the payload with a secret key and an expiration time (optional)
  const token = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Token expires in 7day
  });

  return token;
};

/*
 * Generate a random token using crypto
 * @returns {string} - The generated random token
 */
const genRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/*
 * Generate a token using email
 * @param {string} email - The email to be used for generating the token
 * @returns {string} - The generated token
 */
const genTokenUsingEmail = (email) => {
  const token = jwt.sign({ email }, env.JWT_SECRET_TOKEN, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  return token;
};

/*
 * Verify the token
 * @param {string} token - The token to be verified
 * @returns {Object} - The decoded token if valid, otherwise null
 */
const verifiedTokenForEmail = (token) => {
  if (!token) return null; // Early return for missing token

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_TOKEN);

    // Validate payload structure
    if (!decoded.email) {
      console.error("Token missing email field");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);

    // Differentiate between error types if needed
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT error:", error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Expired token:", error.expiredAt);
    }

    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  genTokenUsingEmail,
  genRandomToken,
  verifiedTokenForEmail,
};
