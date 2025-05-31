/*
 * ADD TO CART
 * adding product to cart
 * remove product from cart
 * @here in remove first remove variant
 * and if all variant removed then remove the product
 
 * fetched all produt from cart
 * all routes need to pass the authethication
 */
const { PrismaClient } = require("../../generated/prisma");
const catchAsync = require("../../utils/catchAsync");
const prisma = new PrismaClient();
const { successResponse } = require("../../utils/response");

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

// Assuming catchAsync and successResponse are defined elsewhere

exports.getCartItems = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch cart items with necessary details from product and variant
    const cartItems = await prisma.cart.findMany({
      where: { userId: Number(userId) },
      select: {
        // Select fields from the Cart model
        id: true, // Keep cart item ID if needed, or remove
        quantity: true,
        // Select specific fields from the related Product model
        product: {
          select: {
            id: true,
            name: true,
            thumnailImage: true, // Assuming you need the thumbnail image
            // Add other product fields you specifically need here (e.g., description, basePrice if not on variant)
          },
        },
        // Select specific fields from the related Variant model
        variant: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true, // Assuming you need the price from the variant
            // Add other variant fields you specifically need here (e.g., sku, stock if needed)
            // Select specific fields from the related Images model
            images: {
              select: {
                url: true, // Assuming you only need the URL of the image
              },
            },
          },
        },
      },
    });

    if (!cartItems || cartItems.length === 0) {
      // Return an empty array and a success message for no items
      return successResponse(res, [], "No items found in the cart", 200);
    }

    // --- Post-process the data to group by product ---
    const groupedCartItems = [];
    const productMap = new Map(); // Use a Map to easily group by product ID

    for (const item of cartItems) {
      const productId = item.product.id;

      if (!productMap.has(productId)) {
        // If this is the first time we see this product, create a new entry
        productMap.set(productId, {
          product: item.product, // Include the product details
          variants_in_cart: [], // Initialize an empty array for variants in this product
        });
      }

      // Add the variant details and quantity to the product's variants_in_cart array
      productMap.get(productId).variants_in_cart.push({
        variant: item.variant, // Include the variant details
        quantity: item.quantity, // Include the quantity from the cart item
        cartItemId: item.id, // Optionally include the original cart item ID
      });
    }

    // Convert the Map values back into an array for the final response
    groupedCartItems.push(...productMap.values());
    // --- End of post-processing ---

    return successResponse(
      res,
      groupedCartItems, // Return the newly structured data
      "Cart product fetch successfully",
      200,
    );
  } catch (error) {
    console.error("Error fetching or processing cart items:", error);
    return next(error);
  }
});

exports.removeCartItem = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get the variantId and quantityToRemove from the request body
    const { variantId } = req.params;
    let { quantityToRemove } = req.body;

    // Validate inputs
    if (!userId) {
      return next(
        new Error("User not authenticated. Cannot remove cart item."),
      );
    }
    if (!variantId) {
      return next(new Error("Missing variantId in request body."));
    }
    if (!quantityToRemove) {
      quantityToRemove = 1; // Default to removing 1 if not specified
    }

    // Find the existing cart item for this user and variant
    const cartItem = await prisma.cart.findFirst({
      // Use findFirst as there should be only one entry per user+variant
      where: {
        userId: userId, // Match the authenticated user ID
        variantId: variantId, // Match the specific variant ID
      },
      select: {
        // Select the current quantity and the item ID
        id: true,
        quantity: true,
      },
    });

    // Check if the cart item exists for this user and variant
    if (!cartItem) {
      // If the item doesn't exist in the cart, there's nothing to remove
      return successResponse(
        res,
        null,
        "Cart item for this variant not found for the user. Nothing to remove.",
        200,
      );
    }

    // Determine the new quantity
    const newQuantity = cartItem.quantity - quantityToRemove;

    // Check if the new quantity is zero or less
    if (newQuantity <= 0) {
      // If removing all or more than the current quantity, delete the item
      await prisma.cart.delete({
        where: { id: cartItem.id }, // Delete using the found cart item's ID
      });

      //REMOVE:
      console.log(
        `Cart item ${cartItem.id} (variant ${variantId}) fully removed for user ${userId}.`,
      );
      return successResponse(
        res,
        null,
        "Cart variant fully removed successfully",
        200,
      );
    } else {
      // If removing less than the current quantity, update the quantity
      const updatedCartItem = await prisma.cart.update({
        where: { id: cartItem.id }, // Update using the found cart item's ID
        data: {
          quantity: newQuantity,
        },
        select: {
          id: true,
          quantity: true,
          productId: true,
          variantId: true,
        },
      });

      //REMOVE
      console.log(
        `Cart item ${cartItem.id} (variant ${variantId}) quantity updated to ${newQuantity} for user ${userId}.`,
      );
      return successResponse(
        res,
        updatedCartItem,
        "Cart item quantity updated successfully",
        200,
      );
    }
  } catch (error) {
    console.error("Error removing or updating cart item:", error);
    return next(error);
  }
});
