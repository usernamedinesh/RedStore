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

module.exports = {
  isOtpExpired,
};
