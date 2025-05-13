const router = require("express").Router();

const {
  AddTOCart,
  getCartItems,
  removeCartItem,
} = require("../../adminControllers/product/AddToCart");
const authMiddleware = require("../../controllers/refresh-token"); /* do i need this middleware */

router.post("/cart", AddTOCart);

/* get cart items  by userId*/
router.get("/cart/:userId", getCartItems);

/* delete an item from cart using cartId */
router.delete("/cart/:cartId", removeCartItem);

module.exports = router;
