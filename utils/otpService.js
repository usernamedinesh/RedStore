// Service to handle OTP saving and sending

const { PrismaClient } = require("../generated/prisma");
const sendOtp = require("../utils/sendOtp");
const prisma = new PrismaClient();

exports.sendOtpWithSave = async ({ otp, email, phoneNo }) => {
  const identifier = email ? { email } : { phoneNo };

  const tempUser = await prisma.tempOtp.upsert({
    where: identifier,
    update: {
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1 * 60 * 1000), // ✅ corrected here
    },
    create: {
      otp,
      ...identifier,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    },
  });

  await sendOtp(email || phoneNo, otp);

  return tempUser;
};
