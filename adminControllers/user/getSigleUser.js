const catchAsync = require("../../utils/catchAsync");
const { PrismaClient } = require("../../generated/prisma");
const { successResponse } = require("../../utils/response");
const prisma = new PrismaClient();

exports.SingleUserById = catchAsync(async (req, res, next) => {
  try {
    const id = req.user.id; // get from the middleware
    const userId = Number(req.params.id);

    const admin = await prisma.user.findUnique({ where: { id: id } });
    if (!admin || admin.userRole !== "ADMIN") {
      return next(new Error("user is not admin !"));
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next(new Error("invalid userId"));
    }

    return successResponse(res, user, "get single user by admin", 200);
  } catch (error) {
    return next(error);
  }
});
