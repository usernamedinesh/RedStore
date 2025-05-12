/*
 * Lets say u forgot the password
 * Then u send the email or phoneNo
 * and send otp to phone or email
 * if otp is matched then add new password
 */
const { PrismaClient } = require("../generated/prisma");
const catchAsync = require("../utils/catchAsync");
const Joi = require("joi");
const { successResponse } = require("../utils/response");
const generateOtp = require("../utils/generateOtp");
const { isEmail, isPhone } = require("../validator/emailPhoneValidator");
const { isOtpExpired } = require("../utils/otpExpiration");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const newPasswordSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
  }),
  otp: Joi.string().min(4).max(4).required().messages({
    "string.otp": "Please provide a valid OTP",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters",
  }),
  phoneNo: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
})
  .or("email", "phoneNo") // ✅ At least one of email or phoneNo is required
  .messages({
    "object.missing": "Either email or phone number is required",
  });

const Schema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
  }),
  phoneNo: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
})
  .or("email", "phoneNo") // ✅ At least one of email or phoneNo is required
  .messages({
    "object.missing": "Either email or phone number is required",
  });

exports.sendOtpFornewpassword = catchAsync(async (req, res, next) => {
  const { error, value } = Schema.validate(req.body, { abortEarly: false });

  if (error) {
    next(error);
  }
  try {
    const { email, phoneNo } = value;

    let findCondition = {};
    if (email && isEmail(email)) findCondition.email = email;
    if (phoneNo && isPhone(phoneNo)) findCondition.phoneNo = phoneNo;

    if (!Object.keys(findCondition).length) {
      return next(new Error("Email or phone number is required"));
    }

    const user = await prisma.user.findUnique({ where: findCondition });
    if (!user) {
      return next(new Error("user not exist !"));
    }
    const otp = generateOtp();

    const data = await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpCreatedAt: new Date(Date.now() + 1 * 60 * 1000), // ✅ corrected here
      },
    });
    // TODO : here need to send the email/sms OTP
    return successResponse(
      res,
      otp,
      "OTP sended for reset-password verification!",
      201,
    );
  } catch (error) {
    return next(error);
  }
});

exports.newPassword = catchAsync(async (req, res, next) => {
  try {
    const { error, value } = newPasswordSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return next(error);
    }
    const { email, phoneNo, otp, password } = value;

    let findCondition = {};
    if (email && isEmail(email)) findCondition.email = email;
    if (phoneNo && isPhone(phoneNo)) findCondition.phoneNo = phoneNo;

    if (!Object.keys(findCondition).length) {
      return next(new Error("Email or phone number is required"));
    }

    const user = await prisma.user.findUnique({ where: findCondition });
    if (!user) {
      return next(new Error("user not exist !"));
    }
    /* check here otp is matchd or nto
     * otp expiration time
     * if otp is matched then hash new password and saved to db
     */

    if (isOtpExpired(user.otpCreatedAt)) {
      return next(new Error("OTP is expired. please request a new one."));
    }
    if (otp != user.otp) {
      return next(new Error("Incorrect OTP!"));
    }
    const newPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
        otp: null,
        otpCreatedAt: null,
      },
    });
    return successResponse(
      res,
      newPassword,
      "Password Changed succussfully!",
      201,
    );
  } catch (error) {
    return next(error);
  }
});
