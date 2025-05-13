const catchAsync = require("../../utils/catchAsync");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.addAddress = catchAsync(async (req, res, next) => {
  const {
    fullName,
    addressLine1,
    addressLine2,
    city,
    state,
    pin,
    phoneNumber,
  } = req.body;

  try {
    const userId = req.user.id;
    if ((!fullName || !addressLine1, !city || !state || !pin || !phoneNumber)) {
      return next(new Error("All fields are required"));
    }
    // const address = await prisma.add;
  } catch (error) {
    console.error("Error adding address:", error);
  }
});
