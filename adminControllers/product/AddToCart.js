/*
 * ADD TO CART
 * adding product to cart
 * remove product from cart
 * fetched all produt from cart
 */
const { PrismaClient } = require("../../generated/prisma");
const catchAsync = require("../../utils/catchAsync");
const prisma = new PrismaClient();
const { successResponse } = require("../../utils/response");

function isEqualVariant(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

exports.AddTOCart = catchAsync(async (req, res, next) => {
  const { userId, productId, quantity, variantId } = req.body;
  if (!userId || !productId || !quantity || !variantId) {
    return next(new Error("Please provide all required fields"));
  }

  try {
    const productExist = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
        variantId,
      },
    });
    if (productExist) {
      const updated = await prisma.cart.update({
        where: { id: productExist.id },
        data: {
          quantity: productExist.quantity + quantity,
        },
      });
      return successResponse(
        res,
        updated,
        "Product Added to cart successfully!",
        200,
      );
    }

    /* create new cart */
    const newProduct = await prisma.cart.create({
      data: {
        userId,
        productId,
        variantId,
        quantity,
      },
    });
    return successResponse(
      res,
      newProduct,
      "Product Added to cart successfully!",
      201,
    );
  } catch (error) {
    return next(error);
  }
});

exports.getCartItems = catchAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cartItems = await prisma.cart.findMany({
      where: { userId: Number(userId) },
      include: {
        product: true,
        variant: {
          include: { images: true },
        },
      },
    });
    if (!cartItems || cartItems.length === 0) {
      return next(new Error("No CartItem found!"));
    }
    return successResponse(
      res,
      cartItems,
      "Cart product fetch successfully",
      200,
    );
  } catch (error) {
    return next(error);
  }
});

exports.removeCartItem = catchAsync(async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const cartItem = await prisma.cart.findUnique({
      where: {
        id: Number(cartId),
      },
    });
    if (!cartItem) {
      return next(new Error("Invalid cartID"));
    }
    await prisma.cart.delete({ where: { id: Number(cartId) } });
    console.log("cartItem: ", cartItem);

    return successResponse(res, null, "Cart Item removed successfully", 200);
  } catch (error) {
    return next(error);
  }
});
