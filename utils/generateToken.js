const jwt = require("jsonwebtoken");
const env = require("../config/envConfig");

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
    expiresIn: "30s", // Token expires in 1 hour
  });

  return token;
};

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

module.exports = { generateAccessToken, generateRefreshToken };
