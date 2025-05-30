const router = require("express").Router();

const {
  AddTOCart,
  getCartItems,
  removeCartItem,
} = require("../../adminControllers/product/AddToCart");
const authMiddleware = require("../../controllers/refresh-token"); /* do i need this middleware */

router.post("/cart", authMiddleware, AddTOCart);

/* get cart items  by userId*/
router.get("/cart/:userId", authMiddleware, getCartItems);

/* delete an item from cart using cartId */
router.delete("/cart/:variantId", authMiddleware, removeCartItem);

module.exports = router;
