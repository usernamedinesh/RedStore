/* ADMIN */

const router = require("express").Router();
const {
  createProduct,
  createCategory,
  getCategory,
  getAllProducts,
  SingleProduct,
  removeProduct,
} = require("../../adminControllers/product/product");
const authMiddleware = require("../../controllers/refresh-token");

router.post("/product", authMiddleware, createProduct); /* create new product */
router.get("/category", authMiddleware, getCategory); /* get all category   */
router.post(
  "/category",
  authMiddleware,
  createCategory,
); /* create new category */
router.get("/product", authMiddleware, getAllProducts); /* get all product */
router.get(
  "/product/:id",
  authMiddleware,
  SingleProduct,
); /* get single proudct */
router.delete("/product/:id", authMiddleware, removeProduct);

module.exports = router;
