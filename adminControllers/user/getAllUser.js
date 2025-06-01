/* Get All User by ADMIN */

const { PrismaClient } = require("../../generated/prisma");
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const prisma = new PrismaClient();

// just and random api for testing purpose
exports.getUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({});
    const owner = await prisma.productOwner.findMany({});
    successResponse(
      res,
      { users, owner },
      "Fetched all users successfully!",
      200,
    );
  } catch (error) {
    next(error);
  }
});
exports.getAllUserByAdmin = catchAsync(async (req, res, next) => {
  try {
    const id = req.user.id; // get from middleware
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user || user.userRole !== "ADMIN") {
      return next(new Error("user not exist or user is not admin"));
    }

    const allUser = await prisma.user.findMany({
      where: {
        id: {
          not: id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        userRole: true,
      },
    });

    return successResponse(
      res,
      allUser,
      "Fetched all user successfully by user!",
      200,
    );
  } catch (error) {
    return next(error);
  }
});
