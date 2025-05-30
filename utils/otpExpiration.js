const OTP_EXPIRATION_MINUTES = 5;

/**
 * Check if OTP is expired based on createdAt timestamp.
 * @param {Date} createdAt - The timestamp when OTP was created.
 * @returns {boolean} - True if expired, false otherwise.
 */
// const isOtpExpired = (createdAt) => {
//   const expirationTime = new Date(
//     createdAt.getTime() + OTP_EXPIRATION_MINUTES * 60000,
//   );
//   return new Date() > expirationTime;
// };

const isOtpExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

const calculateExpirationTime = () => {
  const now = new Date();
  // Add 24 hours in milliseconds (24 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second)
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return expiresAt;
};

module.exports = {
  isOtpExpired,
  calculateExpirationTime,
};
