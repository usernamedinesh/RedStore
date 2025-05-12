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

function generateVariantKey(variantSelection) {
  return Object.entries(variantSelection)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("|");
}

exports.AddTOCart = catchAsync(async (req, res, next) => {
  try {
    const { userId, productId, quantity, variantSelection } = req.body;
    const variantKey = generateVariantKey(variantSelection);
    const productExist = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantKey,
      },
    });
    if (productExist) {
      const updated = await prisma.cartItem.update({
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

    const newProduct = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
        variantSelection,
        variantKey,
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
    const userId = req.params.id;
    const cartTems = await prisma.cartItem.findMany({
      where: { userId: Number(userId) },
      include: {
        product: true,
      },
    });
    if (!cartTems || cartTems.length === 0) {
      return next(new Error("No CartItem found!"));
    }
    return successResponse(
      res,
      cartTems,
      "Cart product fetch successfully",
      200,
    );
  } catch (error) {
    return next(error);
  }
});

exports.removeCartItem = catchAsync(async (req, res, next) => {
  try {
    const { userId, variantSelection, productId } = req.body;
    const cartItem = await prisma.cartItem.findMany({
      where: {
        userId: Number(userId),
        productId,
      },
    });
    console.log("cartItem: ", cartItem);

    const matchingItem = cartItem.find((item) =>
      isEqualVariant(item.variantSelection, variantSelection),
    );

    if (!matchingItem) {
      return next(new Error("Cart Item not found"));
    }
    await prisma.cartItem.delete({ where: { id: matchingItem.id } });
    return successResponse(res, null, "Cart Item removed successfully", 200);
  } catch (error) {
    return next(error);
  }
});
