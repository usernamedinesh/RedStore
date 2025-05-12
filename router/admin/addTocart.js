const router = require("express").Router();

const {
  AddTOCart,
  getCartItems,
  removeCartItem,
} = require("../../adminControllers/product/AddToCart");
const authMiddleware = require("../../controllers/refresh-token"); /* do i need this middleware */

router.post("/cart", AddTOCart);
router.get("/cart/:id", getCartItems);
router.delete("/cart", removeCartItem);

module.exports = router;
