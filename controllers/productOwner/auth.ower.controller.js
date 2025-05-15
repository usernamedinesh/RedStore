/*
 *   -- REQEST --
 *   -- LOGIN --
 *   -- REGISTER --
 *
 *   -- First user will request to create an owner account
 *   -- Using email address and it will save the email and varified "false"
 *   -- Server will save the email and generate an token with the email and with expiration time
 *   -- after successfully register the token will destryo
 *   -- server will send an email to the user with a link to create an account
 *   -- if the user clicks the link, the server will check if the token is valid and not expired
 *   -- if valid, the server will create an account with the email and password and name
 *
 *   TWO ROUTE
 *   -- 1. /api/auth/request
 *   -- 2. /api/auth/register
 *   -- 3. /api/auth/login
 *   -- do i need this routes? later will implement
 *   TODO:
 *   -- 5. /api/auth/forgot-password
 *   -- 6. /api/auth/reset-passwordo
 *   -- 7. /api/auth/verify-email
 */

const { PrismaClient } = require("../../generated/prisma/");
const prisma = new PrismaClient();
const catchAsync = require("../../utils/catchAsync");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { successResponse } = require("../../utils/response");
const {
  genTokenUsingEmail,
  verifiedTokenForEmail,
} = require("../../utils/generateToken");
const { sendRegLinkForOwener } = require("../../service/sendOtp");

/* validate the imput using Joi */
const checkInputSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(4).max(20).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters long",
    "string.max": "Password must be at most 20 characters long",
  }),
}).min(1); // At least one of the fields is required

exports.handleRequest = catchAsync(async (req, res, next) => {
  const { error, value } = checkInputSchema.validate(req.body, {
    abortEarly: true,
    allowUnknown: true,
  });
  if (error) {
    return next({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    const { email } = value;

    const emailExists = await prisma.productOwner.findUnique({
      where: { email: email },
    });

    if (emailExists) {
      return next({
        status: 400,
        message: "Email already exists",
      });
    }

    /* Check first if the email is already exists in the database
     * Generate the token and with expiration date
     * and send the link to the email
     */

    /* generate the token */
    const token = genTokenUsingEmail(email);

    /* save the email and token to the database */
    const newOwer = await prisma.productOwner.create({
      data: {
        token: token,
        isVerified: false,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    /* send the email to the user{ower} */
    sendRegLinkForOwener(email, token);
    successResponse(res, { newOwer }, "send link to email successfully", 201);
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
});

// --- Controller Function to Handle Product Owner Registration ---
// Endpoint: POST /register/:token
exports.handleRegister = catchAsync(async (req, res, next) => {
  // Get the token from URL parameters
  const { token } = req.params;

  // Validate presence of token in URL parameters
  if (!token) {
    // Use a consistent error response format, ideally via your error handling middleware
    const err = new Error("Token is required in URL parameters.");
    err.statusCode = 400; // Custom property for status code
    return next(err);
    // Or return a JSON response directly:
    // return res.status(400).json({ success: false, message: "Token is required in URL parameters." });
  }

  // Validate request body (name and password) using Joi
  // Using abortEarly: false to collect all validation errors
  const { error, value } = checkInputSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true, // Allow fields not defined in checkInputSchema
  });

  if (error) {
    // Return a 400 Bad Request with validation details
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.details.map((d) => d.message), // Return all error messages
    });
    // Alternatively, pass the validation error to your next error handler:
    // const validationError = new Error("Validation Error");
    // validationError.details = error.details.map(d => d.message);
    // validationError.statusCode = 400;
    // return next(validationError);
  }

  // Extract validated name and password
  const { name, password } = value; // Assuming name and password are in the validated value

  try {
    /*
     * -- Token Verification and Owner Lookup --
     * Check if the token is valid, not expired, and corresponds to an owner
     * who hasn't already set their email/password.
     */

    // 1. Verify the token's signature and extract payload (e.g., email)
    let decoded;
    try {
      decoded = verifiedTokenForEmail(token); // Assuming this throws on invalid token
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError.message);
      // Return a specific error for invalid token format/signature
      const err = new Error("Invalid or malformed token.");
      err.statusCode = 400; // Bad Request
      return next(err);
    }
    // Check if the decoded payload contains the expected email
    if (!decoded || !decoded.email) {
      const err = new Error("Invalid token payload. Email missing.");
      err.statusCode = 400; // Bad Request
      return next(err);
    }
    const emailFromToken = decoded.email; // Get email from the verified token

    // 2. Find the ProductOwner record using the token stored in the database
    // IMPORTANT: This assumes the raw token from the URL is stored in the DB.
    // For better security, store a HASHED token in the DB and compare here.
    const owner = await prisma.productOwner.findUnique({
      where: {
        token: token, // Querying by the raw token (less secure)
        // If using hashed tokens, you would query by email or another identifier
        // and then compare the raw token to the hashed token from the DB.
      },
    });

    // 3. Perform checks on the found owner record
    if (!owner) {
      // If no owner found with that token, it's an invalid token/link
      const err = new Error("Invalid token or token not found.");
      err.statusCode = 404; // Not Found
      return next(err);
    }

    if (owner.email) {
      // If the owner record already has an email, they are already registered/verified
      const err = new Error("This account has already been registered.");
      err.statusCode = 400; // Bad Request
      return next(err);
    }

    // Check if the token has expired based on the expiredAt field in the database
    if (owner.expiredAt && new Date(owner.expiredAt) < new Date()) {
      const err = new Error("Token has expired.");
      err.statusCode = 400; // Bad Request
      return next(err);
    }

    /*
     * -- Finalize Registration --
     * If all checks pass, update the owner record with name, email, password,
     * mark as verified, and clear the token fields.
     */

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedOwner = await prisma.productOwner.update({
      where: {
        token: token, // Ensure we update the correct record based on the token
        // If using hashed tokens, the where clause would be different (e.g., by ID or email)
      },
      data: {
        name: name,
        email: emailFromToken, // Use the email from the verified token payload
        password: hashedPassword,
        isVerified: true,
        token: "null", // <-- Corrected: Set token to null instead of ""
        expiredAt: null, // Clear the expiry time
      },
      select: {
        // Select fields to return (exclude password and sensitive info)
        id: true,
        name: true,
        email: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        // Do NOT select password, token, expiredAt
      },
    });
    // Return success response
    successResponse(
      res,
      updatedOwner, // Return the updated owner details (excluding sensitive fields)
      "Product owner registered successfully",
      200, // Use 200 OK for update success, or 201 Created if you consider this the final creation step
    );
  } catch (error) {
    // Catch any other unexpected errors (database errors, etc.)
    console.error("Error in handleRegister:", error);
    // Pass the error to your central error handling middleware
    next(error);
  }
});

exports.handleLogin = catchAsync(async (req, res, next) => {
  /*
   *
   *  -- HERE LOGIN --
   *  -- check if the email and password is valid
   *
   */

  const { error, value } = checkInputSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    return next({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { email, password } = value;
  try {
    const ower = await prisma.productOwner.findUnique({
      where: { email: email },
    });
    if (!ower) {
      return next({
        status: 400,
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, ower.password);
    if (!isMatch) {
      return next({
        status: 400,
        message: "Invalid email or password",
      });
    }
    successResponse(res, ower, "Login successfully", 200);
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
});

exports.handleGetOwner = catchAsync(async (req, res, next) => {
  try {
    const ower = await prisma.productOwner.findMany({
      where: {
        isVerified: true,
      },
    });
    if (!ower) {
      return next({
        status: 400,
        message: "No owner found",
      });
    }
    successResponse(res, ower, "Get owner successfully", 200);
  } catch (error) {
    console.error(error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
});

exports.handleRemoveOwner = catchAsync(async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    if (!ownerId) {
      return next(new Error("Invalid OwnerID"));
    }
    await prisma.productOwner.delete({ where: { id: Number(ownerId) } });
    successResponse(res, null, "Owner deleted successfully", 200);
  } catch (error) {
    console.error("Error while removing owner");
    next(error);
  }
});
