/* user  */
const router = require("express").Router();
const {
  createCategory,
  getAllProducts,
  SingleProduct,
  getCategoryAndBrand,
} = require("../adminControllers/product/product");
const authMiddleware = require("../controllers/refresh-token");

/* get category or brand */
router.get("/category", authMiddleware, getCategoryAndBrand);

/* create new category NOTE: not used*/
router.post("/category", authMiddleware, createCategory);

/* get all product */
/* axios.get(`/api/products?page=${pagination.page}&limit=${pagination.limit}`); */
/*TEST: GET /product?page=2&limit=15 */
router.get("/product", getAllProducts);

/* get single proudct */
router.get("/product/:id", authMiddleware, SingleProduct);

module.exports = router;
