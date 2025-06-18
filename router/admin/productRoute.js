/* ADMIN */

const multer = require("multer");
const storage = require("../../service/file_upload");
const router = require("express").Router();

const upload = multer({ storage: storage });
const {
  createProduct,
  createCategory,
  getAllProducts,
  SingleProduct,
  removeProduct,
  deleteSingleVariants,
  getCategoryAndBrand,
  getProductByOwer,
} = require("../../adminControllers/product/product");
const authMiddleware = require("../../controllers/refresh-token");
const { authenticateAdminWIthJWT } = require("../../middleware/autheAdmin");

/* create product */
router.post("/product/:userId", upload.any(), createProduct);

/* get category or brand */
router.get("/category", authMiddleware, getCategoryAndBrand);

/* create new category NOTE: not used*/
router.post("/category", authMiddleware, createCategory);

/* get all product */
/* axios.get(`/api/products?page=${pagination.page}&limit=${pagination.limit}`); */
/*TEST: GET /product?page=2&limit=15 */
router.get("/product", authMiddleware, getAllProducts);

/* get single proudct */
router.get("/product/:id", authMiddleware, SingleProduct);

/* remove product */
// router.delete("/product/:id", authMiddleware, removeProduct);
router.delete("/product/:id", authenticateAdminWIthJWT, removeProduct);

// delete an variant
router.delete("variants/:variantId", deleteSingleVariants);

router.get("/my-product/:ownerId", getProductByOwer);

module.exports = router;
