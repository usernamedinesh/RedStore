const { PrismaClient } = require("../generated/prisma");
const catchAsync = require("../utils/catchAsync");
const Prisma = new PrismaClient();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { successResponse } = require("../utils/response");

const Schema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be less than 30 characters",
      "string.pattern.base": "Password must be alphanumeric",
    }),
});

exports.login = catchAsync(async (req, res, next) => {
  const { error, value } = Schema.validate(req.body, { abortEarly: false });
  const { email, password } = value;
  console.log(email, password);
  if (error) {
    // const messages = error.details.map((err) => err.message);
    // return res.status(400).json({
    //   status: "fail",
    //   message: "Validation Error",
    //   errors: messages,
    // });
    next(error);
  }
  const user = await Prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new Error("User not exist "));
  }

  // check if password matched
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return next(new Error("Incorrect Password"));
  }

  const token = generateToken({ id: user.id, email: user.email });

  successResponse(res, { token, user }, "user login successfully", 200);
});
