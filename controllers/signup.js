const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");
const prisma = new PrismaClient();
const { successResponse } = require("../utils/response");
const Joi = require("joi");
const sendOtp = require("../utils/sendOtp");
const { sendOtpWithSave } = require("../utils/otpService");
const generateOtp = require("../utils/generateOtp");
const { isOtpExpired } = require("../utils/otpExpiration");
const { isPhone, isEmail } = require("../utils/validator");

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
  userType: Joi.string().valid("admin", "user"),
  phone: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
});

/*
 *
 * In this route I am taking only email | phone
 * And save the email | phone and otp and flag(boolean false) respectivily in db
 * let see user is successly save the email and opt what if user cant successfully register the user
 * after successfully registerd make the otp null
 *
 */

// const { error, value } = userSchema.validate(req.body, { abortEarly: false });

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { phoneOremail } = req.body;

  if (!phoneOremail) {
    return next(new Error("phone/email is required !"));
  }

  const otp = generateOtp();
  let email;
  let phoneNo;
  let findCondition = {};

  if (isEmail(phoneOremail)) {
    email = phoneOremail;
    const emailExist = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExist) {
      return next(new Error("user is already registered"));
    }
    findCondition = { email };
    /* check here if the email is already exist */
    // sendOtp(email, otp);
  } else if (isPhone(phoneOremail)) {
    phoneNo = phoneOremail;
    const phoneExist = await prisma.user.findFirst({
      where: { phoneNo },
    });

    if (phoneExist) {
      return next(new Error("user is already registered"));
    }
    findCondition = { phoneNo };
  } else {
    return next(new Error("Invalid phone or email format"));
  }

  // let tempUser = prisma.tempOtp.findUnique({ where: { findCondition } });
  //
  // if (tempUser) {
  //   tempUser = await prisma.tempOtp.update({
  //     where: findCondition,
  //     data: {
  //       otp,
  //       createdAt: new Date(), // reset timestamp
  //     },
  //   });
  // } else {
  //   //Create  new tempOtp
  //   const dataToSave = { otp };
  //   if (email) dataToSave.email = email;
  //   if (phoneNo) dataToSave.phone = phoneNo;
  //   tempUser = await prisma.tempOtp.create({
  //     data: dataToSave,
  //   });
  // }
  // if (email) {
  //   await sendOtp(email, otp);
  // } else if (phoneNo) {
  //   await sendOtp(phoneNo, otp);
  // }

  const tempUser = await sendOtpWithSave({ otp, email, phoneNo });
  successResponse(res, tempUser, "otp send successfully", 201);
});

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, otp, phoneNo } = req.body;

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
    const token = generateToken(user);
    successResponse(res, { token, user }, "user created successfully", 201);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
