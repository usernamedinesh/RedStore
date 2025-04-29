const jwt = require("jsonwebtoken");
const env = require("../config/envConfig");

/**
 * Generate a JWT token
 * @param {Object} user - The user object (usually from the database)
 * @returns {string} - The generated JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Sign the payload with a secret key and an expiration time (optional)
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  return token;
};

module.exports = generateToken;
