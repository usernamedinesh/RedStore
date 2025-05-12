// controllers/productController.js
const Joi = require("joi");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const { options } = require("../../router/user");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().required(),
});

exports.createCategory = catchAsync(async (req, res, next) => {
  /* here lets create category */
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return next(error);
    }
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });

    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("Admin can perform this operation!"));
    }

    const { name, description } = value;
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    return successResponse(res, category, "Category created successfully", 201);
  } catch (error) {
    return next(error);
  }
});

exports.getCategory = catchAsync(async (req, res, next) => {
  try {
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });

    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("Admin can perform this operation!"));
    }
    const category = await prisma.category.findMany({});
    if (!category) {
      return next(new Error("No Category found"));
    }
    return successResponse(
      res,
      category,
      "Category fetched successfully!",
      200,
    );
  } catch (error) {
    return next(error);
  }
});

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, images, variants } = req.body;
    /* check first admin or not */
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });
    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("only admin can perform this operation!"));
    }

    /* lest find the Category id first */
    const isValidCategory = await prisma.category.findUnique({
      where: { id: req.body.id },
    });
    if (!isValidCategory) {
      return next(new Error("No Such Category Found"));
    }

    const result = await prisma.$transaction(async (prisma) => {
      //create main product
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          stock,
          images,
          categoryId: req.body.id,
        },
      });
      //create variant if provied

      if (variants && variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((v) => ({
            name: v.name,
            options: v.options,
            productId: product.id,
          })),
        });
      }
      return product;
    });

    const createdProduct = await prisma.product.findUnique({
      where: { id: result.id },
      include: { variants: true, category: true },
    });

    return successResponse(
      res,
      createdProduct,
      "Product Created Successfully",
      201,
    );
  } catch (error) {
    return next(error);
  }
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  try {
    /* get all product here */
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });
    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("Only ADMIN can perform this operation!"));
    }
    const product = await prisma.product.findMany({});
    if (!product || product.length === 0) {
      return next(new Error("No Product Found!"));
    }
    return successResponse(res, product, "Product fetched successfully!", 200);
  } catch (error) {
    return next(error);
  }
});

exports.SingleProduct = catchAsync(async (req, res, next) => {
  try {
    /* get single product here */
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });
    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("Only ADMIN can perform this operation!"));
    }
    const produtId = req.params.id;
    const isAvalidProductId = await prisma.product.findUnique({
      where: { id: produtId },
    });
    if (!produtId) {
      return next(new Error("Invalid prodcut id or product not found"));
    }
    return successResponse(
      res,
      isAvalidProductId,
      "Singe Product fetched successfully!",
      200,
    );
  } catch (error) {
    return next(error);
  }
});

exports.removeProduct = catchAsync(async (req, res, next) => {
  try {
    const id = req.user.id;
    const productId = req.params.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });
    const isValidProductId = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (isAdmin.userRole !== "ADMIN" || !isValidProductId) {
      return next(new Error("Only ADMIN perfom this operation!"));
    }
    await prisma.product.delete({
      where: { id: productId },
    });
    return successResponse(res, null, "Product deleted successfully", 200);
  } catch (error) {
    return next(error);
  }
});
