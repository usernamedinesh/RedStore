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
 *
 *   -- ATTENSION --
 *   In the func handleRequest:
 *   In going to encrypt the token and send to the client
 *   In th func handleRegister im gonna decrypt it
 */

const { PrismaClient } = require("../../generated/prisma/");
const prisma = new PrismaClient();
const catchAsync = require("../../utils/catchAsync");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { successResponse } = require("../../utils/response");
const CustomError = require("../../utils/customError");
const {
  genTokenUsingEmail,
  verifiedTokenForEmail,
} = require("../../utils/generateToken");
const { sendRegLinkForOwener } = require("../../service/sendOtp");
const runCryptoTask = require("../../worker/encryptDecrypt");
const env = require("../../config/envConfig");

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
    console.log("emailExists: ", emailExists);
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
    let token = genTokenUsingEmail(email);

    /* save the email and token to the database */
    const newOwer = await prisma.productOwner.create({
      data: {
        token: token,
        isVerified: false,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    /* send the email to the user{ower} */
    /* encrypt the token  */
    token = await runCryptoTask("encrypt", token, env.SECRET_KEY);
    console.log("encryptedToken: ", token);
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
  let { token } = req.params;

  if (!token) {
    const err = new Error("Token is required in URL parameters.");
    err.statusCode = 400;
    return next(err);
  }

  const { error, value } = checkInputSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true, // Allow fields not defined in checkInputSchema
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.details.map((d) => d.message),
    });
  }

  const { name, password } = value;

  try {
    /* get the actual token here
     * decrypt the token
     *
     * it will decrypt the token from the encrypted token
     */
    token = await runCryptoTask("decrypt", token, env.SECRET_KEY);

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
      err.statusCode = 400;
      return next(err);
    }
    // Check if the decoded payload contains the expected email
    if (!decoded || !decoded.email) {
      const err = new Error("Invalid token payload. Email missing.");
      err.statusCode = 400; // Bad Request
      return next(err);
    }
    const emailFromToken = decoded.email;

    // 2. Find the ProductOwner record using the token stored in the database
    // IMPORTANT: This assumes the raw token from the URL is stored in the DB.
    // For better security, store a HASHED token in the DB and compare here.
    const owner = await prisma.productOwner.findUnique({
      where: {
        token: token,
      },
    });

    // 3. Perform checks on the found owner record
    if (!owner) {
      const err = new Error("Invalid token or token not found.");
      err.statusCode = 404;
      return next(err);
    }

    if (owner.email) {
      // If the owner record already has an email, they are already registered/verified
      const err = new Error("This account has already been registered.");
      err.statusCode = 400;
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
        token: token,
      },
      data: {
        name: name,
        email: emailFromToken, // Use the email from the verified token payload
        password: hashedPassword,
        isVerified: true,
        // token: "null", // i cant make it null because of unique
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
      "OWNER registered successfully",
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

exports.getOwnersProduct = catchAsync(async (req, res, next) => {
  try {
    //get the owner if from the req.user.id
    const userId = req.user.id;

    //ONLY product have the its creator ID
    const products = await prisma.product.findUnique({
      where: { ownerId: Number(userId) },
      // do i need to select i dont think so
    });
    // OWNER doesnot have the product id
    // Product have the OWNERR id

    if (products.length === 0 || !products) {
      return next(CustomError("product not exist ", 404));
    }
    successResponse(res, products, "fetched fetched by owner ", 200);
  } catch (error) {
    console.error("Errow while fetching product of Itself");
    next(error);
  }
});

exports.verifyTokenForOnwer = catchAsync(async (req, res, next) => {
  try {
    const { token } = req.body;
    console.log("Token received for verification:", token);
    if (!token) {
      return next(new Error("Token is required"));
    }
    // Decrypt the token
    const decryptedToken = await runCryptoTask(
      "decrypt",
      token,
      env.SECRET_KEY,
    );

    // Verify the token
    const verifiedData = verifiedTokenForEmail(decryptedToken);
    if (!verifiedData || !verifiedData.email) {
      return next(new Error("Invalid or expired token"));
    }

    // Check if the owner exists with the email from the token
    const owner = await prisma.productOwner.findUnique({
      where: { email: verifiedData.email },
    });
    if (!owner) {
      return next(new Error("Owner not found"));
    }
    // If everything is fine, return the owner data
    successResponse(res, owner, "Owner account verified successfully", 200);
  } catch (error) {
    console.error("Error while verifying owner account");
    return next;
  }
});
