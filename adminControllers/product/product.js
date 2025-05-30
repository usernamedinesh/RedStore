// controllers/productController.js

const { client: redis, policies } = require("../../config/redisConfig");
const { getProductKey, getProductTTL } = require("../../redis/cache.redis");
const customError = require("../../utils/customError");

const Joi = require("joi");
const { PrismaClient, Gender } = require("../../generated/prisma");
const prisma = new PrismaClient();
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");

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

exports.getCategoryAndBrand = catchAsync(async (req, res, next) => {
  try {
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });

    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("Admin can perform this operation!"));
    }
    const [categories, brands] = await Promise.all([
      prisma.category.findMany(),
      prisma.brand.findMany(),
    ]);

    if (!categories || categories.length === 0) {
      return next(new Error("No Category Found!"));
    }

    return successResponse(
      res,
      { categories, brands },
      "Category fetched successfully!",
      200,
    );
  } catch (error) {
    return next(error);
  }
});

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      basePrice,
      categoryName,
      brandName,
      images,
      gender = "UNISEX",
      variants = [],
    } = req.body;

    /*
     * PICK AND RANDOM IMAGE FROM IMAGES ARRAY
     */

    let AllImage = variants.flatMap((v) => v.images || []);
    const randomImage =
      AllImage.length > 0
        ? AllImage[Math.floor(Math.random() * AllImage.length)]
        : null;

    // Check if user is admin
    // const id = req.user.id;
    // const user = await prisma.user.findUnique({ where: { id } });
    //
    // if (user.userRole !== "ADMIN") {
    //   return next(new Error("Only admin can perform this operation!"));
    // }
    const { userId } = req.params;

    /* check userId is valid or not */

    const validUserId = await prisma.productOwner.findUnique({
      where: { id: Number(userId) },
    });
    if (!userId || !validUserId) {
      return next(new Error("OwnerId is needed!"));
    }

    // Validate required fields
    if (
      !name ||
      !description ||
      !basePrice ||
      !categoryName ||
      !brandName ||
      !variants.length
    ) {
      return next(new Error("All fields are required bro"));
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // Find or create brand
    let brand = await prisma.brand.findFirst({ where: { name: brandName } });
    if (!brand) {
      brand = await prisma.brand.create({ data: { name: brandName } });
    }

    // Create product inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          description,
          ownerId: Number(userId),
          gender,
          basePrice,
          categoryId: category.id,
          brandId: brand.id,
          thumnailImage: randomImage || "",
          variants: {
            create: variants.map((v) => ({
              size: v.size,
              color: v.color,
              price: v.price,
              stock: v.stock,
              sku: v.sku,
              images: {
                create: v.images.map((url) => ({ url })),
              },
            })),
          },
        },
        include: {
          variants: {
            include: {
              images: true,
            },
          },
        },
      });

      return product;
    });

    return successResponse(res, result, "Product Created Successfully", 201);
  } catch (error) {
    return next(error);
  }
};

/*
 * ---get all products
 *  [public route]
 */
exports.getAllProducts = catchAsync(async (req, res, next) => {
  try {
    // 1. Admin verification (optimized query)
    const user = await prisma.user.findUnique({
      // where: { id: req.user.id },
      where: { id: 2 }, // for testing purpost TODO: remove  this
      select: { userRole: true }, // Only fetch needed field
    });

    /* lets remove this */
    if (!user || user.userRole !== "ADMIN") {
      return next(
        new customError("Access denied: Admin privileges required", 403),
      );
    }

    // 2. Pagination setup with validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10, 100)); // Max 100 items
    const skip = (page - 1) * limit;

    // 3. Cache operations
    const cacheKey = getProductKey(page, limit);
    const cachedData = await redis.get(cacheKey);

    //TODO: disble cache
    // if (cachedData) {
    //   const { data, message } = JSON.parse(cachedData);
    //   return successResponse(res, data, message);
    // }

    // 4. Database query (optimized)
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        select: {
          // Explicitly select fields for security
          id: true,
          name: true,
          basePrice: true, // new added
          gender: true,
          category: { select: { name: true } },
          brand: { select: { name: true } },
          owner: true,
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              price: true,
              stock: true,
              sku: true,
              images: { select: { url: true } },
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    // 5. Handle empty results
    if (!products.length) {
      return successResponse(res, [], "No products found", 200);
    }

    // 6. Prepare and cache response
    const responseData = {
      products,
      pagination: {
        totalItems: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        nextPage: page * limit < totalProducts ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    await redis.setEx(
      cacheKey,
      getProductTTL(),
      JSON.stringify({
        data: responseData,
        message: "Products fetched successfully",
      }),
    );

    // 7. Send response
    return successResponse(res, responseData, "Products fetched successfully");
  } catch (error) {
    // 8. Improved error handling
    if (!error.statusCode) error.statusCode = 500;
    return next(error);
  }
});

/*
 * recently visited
 * every time a user visits a product, store it to the modle or redis
 * if i store in db it will be issue ? or not
 */
exports.SingleProduct = catchAsync(async (req, res, next) => {
  try {
    /* get single product here */
    const id = req.user.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });
    if (isAdmin.userRole !== "ADMIN") {
      return next(new Error("Only ADMIN can perform this operation!"));
    }
    const produtId = req.params.id;
    const product = await prisma.product.findUnique({
      where: { id: produtId },
      include: {
        category: true,
        Gender,
        brand: true,
        variants: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!product) {
      return next(new Error("Invalid prodcut id or product not found"));
    }
    // here add the userId to visitor
    // TODO:
    return successResponse(
      res,
      product,
      "Singe Product fetched successfully!",
      200,
    );
  } catch (error) {
    return next(error);
  }
});

/* prouduct fetched by owner of the product */
exports.getProductByOwer = catchAsync(async (req, res, next) => {
  const { ownerId } = req.params;
  if (!ownerId) {
    return next(new Error("OwnerId is required !"));
  }
  try {
    const products = await prisma.product.findMany({
      where: { ownerId: Number(ownerId) },
      include: {
        owner: true, // Include the owner details if needed
        category: true, // Optionally include related category
        brand: true, // Optionally include related brand
        variants: true, // Optionally include product variants
      },
    });

    if (!products.length) {
      return res.json({
        success: true,
        message: "No products found for this owner",
        owner: null,
        data: [],
      });
    }

    const owner = {
      name: products[0].owner.name,
      email: products[0].owner.email,
    };

    const simplifiedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      gender: product.gender,
      basePrice: product.basePrice,
      thumnailImage: product.thumnailImage,
      category: product.category.name,
      brand: product.brand.name,
      variants: product.variants.map((v) => ({
        size: v.size,
        color: v.color,
        stock: v.stock,
        price: v.price,
        sku: v.sku,
      })),
    }));

    successResponse(
      res,
      { owner, simplifiedProducts },
      "my product fetched successfully",
      200,
    );
  } catch (error) {
    console.error("Error in fecthing my products");
    next(error);
  }
});

exports.removeProduct = catchAsync(async (req, res, next) => {
  try {
    /*
     *---params{id} will be the admin id
     *---params{productId} will be the product id
     */
    const id = req.user.id;
    const productId = req.params.id;
    const isAdmin = await prisma.user.findUnique({ where: { id: id } });
    const isValidProductId = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
      },
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

exports.deleteSingleVariants = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;

  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      return next(new Error("Variant not found!"));
    }
    const deletedVariant = await prisma.productVariant.delete({
      where: { id: variantId },
    });
    successResponse(res, deletedVariant, "Variant deleted successfully", 200);
  } catch (error) {
    next(error);
  }
});
