const { PrismaClient } = require("../generated/prisma");
const catchAsync = require("../utils/catchAsync");
const Prisma = new PrismaClient();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { successResponse } = require("../utils/response");
const { isEmail, isPhone } = require("../validator/emailPhoneValidator");

const schema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
  }),
  phoneNo: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters",
  }),
})
  .or("email", "phoneNo") // ✅ At least one of email or phoneNo is required
  .messages({
    "object.missing": "Either email or phone number is required",
  });

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    const { email, password, phoneNo } = value;

    if (!isEmail(email)) return next(error);
    if (!isPhone(phoneNo)) return next(error);

    let findCondition = {};
    if (email) findCondition.email = email;
    if (phoneNo) findCondition.phoneNo = phoneNo;

    if (error) {
      next(error);
    }
    const user = await Prisma.user.findFirst({
      where: findCondition,
    });

    if (!user) {
      return next(new Error("User not exist "));
    }

    // check if password matched
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(new Error("Incorrect Password"));
    }

    /* generate both accessToken and refreshToken
     * send the accessToken in body
     * send refreshToken in http-only cookie
     */
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });
    await Prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    successResponse(res, { accessToken, user }, "user login successfully", 200);
  } catch (error) {
    next(error);
  }
});
