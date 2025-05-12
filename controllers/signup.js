const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const prisma = new PrismaClient();
const { successResponse } = require("../utils/response");
const Joi = require("joi");
// const sendOtp = require("../utils/sendOtp");
const { sendOtpWithSave } = require("../service/otpService");
const generateOtp = require("../utils/generateOtp");
const { isOtpExpired } = require("../utils/otpExpiration");
const { isPhone, isEmail } = require("../validator/emailPhoneValidator");

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
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
  otp: Joi.string().required(),
})
  .or("email", "phoneNo") // ✅ At least one of email or phoneNo is required
  .messages({
    "object.missing": "Either email or phone number is required",
  });
/*
 *
 * In this route I am taking only email | phone
 * And save the email | phone and otp and flag(boolean false) respectivily in db
 * let see user is successly save the email and opt what if user cant successfully register the user
 * after successfully registerd make the otp null
 *
 */

exports.verifyOtp = catchAsync(async (req, res, next) => {
  // const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  const { phoneOremail } = req.body;

  if (!phoneOremail) {
    return next(new Error("phone/email is required !"));
  }
  try {
    const otp = generateOtp();
    let email;
    let phoneNo;

    if (isEmail(phoneOremail)) {
      email = phoneOremail;
      const emailExist = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExist) {
        return next(new Error("user is already registered"));
      }
    } else if (isPhone(phoneOremail)) {
      phoneNo = phoneOremail;
      const phoneExist = await prisma.user.findFirst({
        where: { phoneNo },
      });

      if (phoneExist) {
        return next(new Error("user is already registered"));
      }
    } else {
      return next(new Error("Invalid phone or email format"));
    }

    const tempUser = await sendOtpWithSave({ otp, email, phoneNo });
    successResponse(res, tempUser, "otp send successfully", 201);
  } catch (error) {
    next(error);
  }
});

exports.register = catchAsync(async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(error);
  }
  const { name, email, password, otp, phoneNo } = value;

  /* here need to sanitize body */
  if (!name || !password || !otp) {
    return next(new Error("Missing required fields"));
  }

  let findCondition = {};
  if (email) findCondition.email = email;
  if (phoneNo) findCondition.phoneNo = phoneNo;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({ where: findCondition });
    if (existingUser) {
      return next(new Error("Email already exists"));
    }
    /* here check email is exit or not in temp if exist then match the otp */
    // check both phoneNo or email
    const emailInTemp = await prisma.tempOtp.findFirst({
      where: findCondition,
    });

    if (!emailInTemp) {
      return next(new Error("Email not found or OTP expired !"));
    }
    if (emailInTemp) {
      /*if otp is matched then check expiration time */
      /* check here if the otp is matched or not */
      if (isOtpExpired(emailInTemp.expiresAt)) {
        return next(new Error("OTP is expired. please request a new one."));
      }
      if (otp !== emailInTemp.otp) {
        return next(new Error("OTP is not matched"));
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNo,
      },
    });

    // ✅ OTP matched — now delete from TempOtp
    await prisma.tempOtp.deleteMany({ where: findCondition });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    successResponse(
      res,
      { accessToken, user },
      "user created successfully",
      201,
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});
