/*
 * here /order
 *
 *
 */
const {
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");
const { PrismaClient } = require("../../generated/prisma/");
const prisma = new PrismaClient();
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const {
  placeOrderSchema,
} = require("../../validator/orderInitiatorValidator.Joi");

exports.placeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { error, value } = placeOrderSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });
  try {
    if (error) {
      return next({
        status: 400,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    const { shippingAddressId, billingAddressId, paymentMethod } = value;
    // fetch checkout date from database
    const checkoutItems = await prisma.checkoutItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        variant: {
          select: {
            id: true,
            price: true,
            stock: true,
            productId: true,
          },
        },
      },
    });

    // check if the checkout items are empty
    if (!checkoutItems || checkoutItems.length === 0) {
      return next({
        status: 400,
        message: "No items in the checkout",
      });
    }

    // check if the items are in stock
    const insufficientStockItems = [];
    for (const item of checkoutItems) {
      if (!item.variant || item.quantity > item.variant.stock) {
        insufficientStockItems.push({
          variantId: item.variantId,
          requestedQuantity: item.quantity,
          availableStock: item.variant ? item.variant.stock : 0,
        });
      }
    }

    if (insufficientStockItems.length > 0) {
      return next({
        status: 400,
        message: "Insufficient stock for the following items",
        data: insufficientStockItems,
      });
    }

    // calculate the total amount
    // this is necesary i guess
    let subtotal = 0;
    for (const item of checkoutItems) {
      subtotal += item.variant.price * item.quantity;
    }
    let paymentStatus = "PENDING";
    let transactionId = null;
    let gatewayResponse = null;

    if (paymentMethod !== "COD") {
      //online payment
      try {
        // initiate payment
        paymentStatus = "SUCCESS";
        transactionId = "transactionId" + Date.now();
        gatewayResponse = {
          status: "success",
        };
      } catch (paymentError) {
        console.error("Payment error:", paymentError);
        return next({
          status: 500,
          message: "Payment processing failed",
          details: paymentError.message,
        });
      }
    } else {
      // cod payment
      paymentStatus = "PENDING";
      transactionId = null;
      gatewayResponse = null;
      console.log("COD payment selected");
    }

    // create order
    const order = await prisma.$transaction(async (prisma) => {
      const createOrder = await prisma.order.create({
        data: {
          userId: userId,
          shippingAddressId: shippingAddressId,
          totalAmount: subtotal,
          status: paymentStatus === "SUCCESS" ? "FAIL" : "PENDING",
        },
      });
      // create order and reduce the stock
      const orderItemData = [];
      for (const item of checkoutItems) {
        orderItemData.push({
          orderId: createOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.price,
          productId: item.variant.productId,
        });
        // reduce the stock
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      // create order items using bulk create
      await prisma.orderItem.createMany({
        data: orderItemData,
      });

      // create payment
      await prisma.payment.create({
        data: {
          orderId: createOrder.id,
          paymentMethod: paymentMethod,
          amount: subtotal,
          status: paymentStatus,
          transactionId: transactionId,
          gatewayResponse: gatewayResponse,
        },
      });
      // remove the checkoutItems no need
      await prisma.checkoutItem.deleteMany({
        where: { userId: userId },
      });

      // return the created order
      return createOrder;
    });

    successResponse(
      res,
      {
        orderId: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
      },
      "Order placed successfully! hell fucked",
      201,
    );

    /* TODO:
     --- Optional: Trigger Post-Order Processes ---
       After the response is sent, you might trigger background tasks like:
     - Sending order confirmation email to the user
     - Notifying admin/fulfillment system about the new order
     - If paymentStatus was 'PENDING' (e.g., for COD), no further action needed immediately.
     - If paymentStatus was 'SUCCESS', you might trigger fulfillment logic.
    */
  } catch (err) {
    if (error instanceof PrismaClientValidationError) {
      return next({
        status: 400,
        message: "Invalid data provided",
        details: error.message,
      });
    }
    console.error("Error placing order:", err);
    next(err);
  }
});

// --- Placeholder for Payment Gateway Integration ---
//  function based on the specific payment gateway SDK/API
/*
async function initiatePaymentWithGateway(paymentMethod, amount, paymentToken, gatewaySpecificData) {
    // Example using a hypothetical Stripe SDK
    if (paymentMethod === 'STRIPE') {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Amount in cents
                currency: 'usd', // Your currency
                payment_method: paymentToken, // Token from frontend
                confirm: true, // Confirm the payment immediately
                // ... other necessary parameters (metadata, description, etc.)
            });

            if (paymentIntent.status === 'succeeded') {
                return {
                    success: true,
                    transactionId: paymentIntent.id,
                    rawResponse: paymentIntent,
                };
            } else {
                 // Handle other statuses like 'requires_action', 'requires_confirmation', etc.
                 // This might require returning specific info to the frontend for 3D Secure etc.
                 console.warn("Stripe payment initiation status:", paymentIntent.status);
                 return {
                     success: false,
                     message: `Stripe payment status: ${paymentIntent.status}`,
                     rawResponse: paymentIntent,
                 };
            }

        } catch (stripeError) {
            console.error("Stripe API Error:", stripeError);
            throw new Error(`Stripe payment failed: ${stripeError.message}`);
        }
    }
    // Add logic for other payment methods (PayPal, etc.)
    else {
        throw new Error(`Payment method ${paymentMethod} not supported yet.`);
    }
}
*/

/*
     router.post('/orders', placeOrder);
     routes for fetching order history and specific order details
     router.get('/orders', getOrderHistory);
     router.get('/orders/:orderId', getOrderDetails);
*/
