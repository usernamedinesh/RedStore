/* Take the old password and add the new passord */
const Joi = require("joi");
const { PrismaClient } = require("../generated/prisma");
const catchAsync = require("../utils/catchAsync");
const { successResponse } = require("../utils/response");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const userSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
});

exports.changePassword = catchAsync(async (req, res, next) => {
  /* Take the new password and validate */
  /* and check old password is correct or not */
  /* and compare it */

  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      next(error);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return next(new Error("user not exist !"));
    }
    const isPasswordMatched = bcrypt.compare(value.password, user.password);
    if (!isPasswordMatched) {
      return next(new Error("password is not matched"));
    }
    return successResponse(res, null, "password changed succussfully", 200);
  } catch (error) {
    next(error);
  }
});
