const Joi = require("joi");

exports.addAddressSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required(),
  addresLine1: Joi.string().trim().min(3).required(),
  addresLine2: Joi.string().trim().min(3).optional(),
  city: Joi.string().trim().min(3).max(50).required(),
  postalCode: Joi.string().trim().min(5).max(10).required(),
  phoneNumber: Joi.string().trim().required(),
  state: Joi.string().trim().min(2).max(50).required(),
});

exports.updateAddressSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).optional(),
  addresLine1: Joi.string().trim().min(3).optional(),
  addresLine2: Joi.string().trim().min(3).optional(),
  city: Joi.string().trim().min(3).max(50).optional(),
  postalCode: Joi.string().trim().min(5).max(10).optional(),
  phoneNumber: Joi.string().trim().optional(),
}).min(1); // At least one field must be present
