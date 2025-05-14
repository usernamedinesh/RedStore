const {
  getAddress,
  updateAddress,
  addAddress,
  deleteAddress,
} = require("../controllers/order/address.Controller");
const authMiddleware = require("../controllers/refresh-token");
const {
  initiateCheckoutBuyNow,
  initiateCheckoutFromCart,
  orderSummery,
} = require("../controllers/order/checkout.Controller");
const router = require("express").Router();

/* get address */
router.get("/address", authMiddleware, getAddress);

/* add new address */
router.post("/address/new", authMiddleware, addAddress);

/* update address */
router.put("/address/:addressId", authMiddleware, updateAddress);

/* delete address */
router.delete("/address/:addressId", authMiddleware, deleteAddress);

/* initiate order from the cart */
router.post("/checkout/cart", authMiddleware, initiateCheckoutFromCart);

/* buy-now directly */
router.post("/checkout/buy-now", authMiddleware, initiateCheckoutBuyNow);

/* get order summerty */
router.get("/summery", authMiddleware, orderSummery);

module.exports = router;
