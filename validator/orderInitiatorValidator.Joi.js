const Joi = require("joi");

exports.initiateBuyNowSchema = Joi.object({
  variantId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

exports.initiateCheckoutFromCartSchema = Joi.object({
  variantId: Joi.string().uuid().optional().allow(null, ""),
});

exports.placeOrderSchema = Joi.object({
  shippingAddressId: Joi.string().uuid().required(),
  billingAddressId: Joi.string().uuid().required(),

  paymentMethod: Joi.string()
    .valid("COD", "CREDIT_CARD", "DEBIT_CARD", "UPI", "PAYPAL", "STRIPE")
    .required(),
  // paymentToken : Joi.string().required(), // may be
});
