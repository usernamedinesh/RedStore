/*
 * initiate the order cretion and payment
 * And before initiating the order lets store the order in the database
 * do i need this two endpoints?
 * i can make it one endpoints which will handle both
 * but first i want to see the frontend then i can see
 * what is good and what is best
 * POST /api/checkout/initiate-from-car
 * POST /api/checkout/initiate-buy-now
 * GET /api/checkout/items (order summery) do i need this route?
 * make it
 * MAKE ORDER finalize the order
 */
const catchAsync = require("../../utils/catchAsync");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const {
  initiateBuyNowSchema,
  initiateCheckoutFromCartSchema,
} = require("../../validator/orderInitiatorValidator.Joi");
const { calculateExpirationTime } = require("../../utils/otpExpiration");
const { successResponse } = require("../../utils/response");

/*
 * buy from the card
 * if there is variantId id mean only one item is selected to buy from cart
 * if there is no variantId id mean all items are selected to buy from cart
 */
exports.initiateCheckoutFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const { error, value } = initiateCheckoutFromCartSchema.validate(req.body, {
    abortEarly: false,
  });
  try {
    if (error) {
      return next({
        status: 400,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    const { variantId } = value;

    // Clear existing checkout items for this user
    await prisma.checkoutItem.deleteMany({ where: { userId } });

    let cartItemsToCheckout;

    if (variantId) {
      // Only checkout this one variant
      cartItemsToCheckout = await prisma.cart.findMany({
        where: { userId, variantId },
        select: { variantId: true, quantity: true },
      });
    } else {
      // Checkout all cart items
      cartItemsToCheckout = await prisma.cart.findMany({
        where: { userId },
        select: { variantId: true, quantity: true },
      });
    }

    if (!cartItemsToCheckout || cartItemsToCheckout.length === 0) {
      return next(new Error("No cart items found to checkout."));
    }

    const expiryTime = calculateExpirationTime();
    const checkoutItemsData = cartItemsToCheckout.map((item) => ({
      userId,
      variantId: item.variantId,
      quantity: item.quantity,
      expiresAt: expiryTime,
    }));

    await prisma.checkoutItem.createMany({ data: checkoutItemsData });

    const fetchedCheckoutItems = await prisma.checkoutItem.findMany({
      where: { userId },
      include: {
        variant: {
          select: {
            id: true,
            price: true,
            productId: true,
            product: {
              select: {
                id: true,
                name: true,
                thumnailImage: true,
              },
            },
          },
        },
      },
    });

    return successResponse(
      res,
      fetchedCheckoutItems,
      "Checkout initiateItem successfully",
      201,
    );
  } catch (error) {
    console.error("Error in initiate order from cart", error);
    next(error);
  }
});

// POST /api/checkout/initiate-buy-now
// when the user click on buy now button
exports.initiateCheckoutBuyNow = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const { error, value } = initiateBuyNowSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false, // Prevent unknown fields
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new Error(`Validation failed: ${errorMessages}`, 400));
  }

  const { variantId, quantity } = value;

  try {
    // 2. Transaction for atomic operations
    const result = await prisma.$transaction(async (prisma) => {
      // Clear existing checkout items
      await prisma.checkoutItem.deleteMany({
        where: { userId },
      });

      // Verify variant exists and has stock
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: {
          id: true,
          price: true,
          stock: true,
          productId: true,
          product: {
            select: {
              name: true,
              id: true,
              thumnailImage: true,
            },
          },
        },
      });

      if (!variant) {
        throw new AppError("Product variant not found", 404);
      }

      if (variant.stock < quantity) {
        throw new AppError(`Only ${variant.stock} items available`, 400);
      }

      // Create new checkout item
      return await prisma.checkoutItem.create({
        data: {
          // Fixed property name (was 'date')
          userId,
          variantId,
          quantity,
          expiresAt: calculateExpirationTime(),
          // price: variant.price, // Store price snapshot i dont think it is required
        },
        include: {
          variant: {
            select: {
              id: true,
              price: true,
              product: {
                select: {
                  name: true,
                  id: true,
                  thumnailImage: true,
                },
              },
            },
          },
        },
      });
    });

    return successResponse(
      res,
      result,
      `Buy Now checkout initiated for variant ${variantId}`,
      201,
    );
  } catch (error) {
    // 4. Error handling
    if (!error.statusCode) error.statusCode = 500;
    console.error("Checkout initiation failed:", error);
    next(error);
  }
});

/*
 * get an userId from req.user.id
 * get all checkout items from database
 * im sure there will be only one item
 * which will be the last item
 */

exports.orderSummery = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;
    // i think do i need to fetch address
    const address = await prisma.address.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    // fetch the checkoutItems
    const checkoutItems = await prisma.checkoutItem.findMany({
      where: { userId: userId },
      include: {
        variant: {
          select: {
            id: true,
            price: true,
            productId: true,
            product: {
              select: {
                id: true,
                name: true,
                thumnailImage: true,
              },
            },
            images: {
              select: { url: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!checkoutItems || checkoutItems.length === 0) {
      return successResponse(res, [], "Checkout items not found", 200);
    }
    successResponse(
      res,
      { checkoutItems, address },
      "Checkout items fetched successfully",
      200,
    );
  } catch (error) {
    console.error("Error in order summary", error);
    next(error);
  }
});
