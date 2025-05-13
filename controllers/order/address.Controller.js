const catchAsync = require("../../utils/catchAsync");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const { successResponse } = require("../../utils/response");
const {
  addAddressSchema,
  updateAddressSchema,
} = require("../../validator/addressValidator.Joi");
const {
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");

exports.addAddress = catchAsync(async (req, res, next) => {
  const { error, value } = addAddressSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return next(new Error(errorMessages.join(", ")));
  }

  const validateData = value;

  /*
   * ---@params A user can make only 4 address
   * check here by adding limit
   */
  const addressCount = await prisma.address.count({
    where: {
      userId: req.user.id,
    },
  });
  const ADDRESS_LIMIT = 4;
  if (addressCount >= ADDRESS_LIMIT) {
    return next(
      new Error(
        `You have reached the maximum limit of ${ADDRESS_LIMIT} addresses.`,
      ),
    );
  }

  try {
    const userId = req.user.id;

    const address = await prisma.address.create({
      data: {
        userId,
        ...validateData,
      },
    });
    successResponse(res, address, "Address added successfully", 201);
    // const address = await prisma.add;
  } catch (error) {
    console.error("Error adding address:", error);
  }
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  try {
    const address = await prisma.address.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },

      /* i can select optionally */
      // select: {
      //   id: true,
      //   fullName: true,
      //   addressLine1: true,
      //   addressLine2: true,
      //   city: true,
      //   state: true,
      //   postalCode: true,
      //   phoneNumber: true,
      // },
    });
    if (!address || address.length === 0) {
      return next(new Error("No address found for this user"));
    }
    successResponse(res, address, "Address fetched successfully", 200);
  } catch (error) {
    console.error("Error fetching address:", error);
    next(error);
  }
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.user.id;

  const { error, value } = updateAddressSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return next(new Error(errorMessages.join(", ")));
  }
  const updateData = value;
  if (Object.keys(updateData).length === 0) {
    return next(new Error("No fields to update"));
  }
  try {
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
        userId: userId,
      },
      data: {
        ...updateData,

        /* optional */
        // fullName: updateData.fullName,
        // addresLine1: updateData.addresLine1,
        // addresLine2: updateData.addresLine2,
        // city: updateData.city,
        // state: updateData.state,
        // postalCode: updateData.postalCode,
        // phoneNumber: updateData.phoneNumber,
        // updatedAt is automatic
      },
    });
    successResponse(res, updatedAddress, "Address updated successfully", 200);
  } catch (error) {
    // --- Enhanced Error Handling ---
    // Check specifically for PrismaClientValidationError (data format issues)
    if (error instanceof PrismaClientValidationError) {
      console.error("Prisma Validation Error updating address:", error.message); // Log the specific Prisma error message
      return res.status(400).json({
        // 400 Bad Request for invalid input data
        success: false,
        message: "Invalid data provided for address update.",
        details: error.message, // Include Prisma's message for debugging
      });
    } else if (error.code === "P2025") {
      return next(
        new Error(
          `Address with ID ${addressId} not found or does not belong to this user.`,
        ),
      );
    } else console.error("Error updating address:", error);
    next(error);
  }
});

/* 
 * delete address
---@parms{id} userId
---@parms{addressId} id of address to delete
*/
exports.deleteAddress = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { addressId } = req.params;
  try {
    const deletedAddress = await prisma.address.delete({
      where: {
        id: addressId,
        userId: userId,
      },
    });
    successResponse(res, deletedAddress, "Address deleted successfully", 200);
  } catch (error) {
    // --- Enhanced Error Handling --- NOTE: important
    if (error.code === "P2025") {
      // This handles cases where the addressId exists but doesn't match the userId,
      // or the addressId simply doesn't exist at all.
      return next(
        new Error(
          `Address with ID ${addressId} not found or does not belong to this user.`,
        ),
      );
    }
    console.error("Error deleting address:", error);
    next(error);
  }
});
