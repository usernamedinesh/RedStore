const {
  getAddress,
  updateAddress,
  addAddress,
  deleteAddress,
} = require("../controllers/order/address.Controller");
const authMiddleware = require("../controllers/refresh-token");
const router = require("express").Router();

/* get address */
router.get("/address", authMiddleware, getAddress);

/* add new address */
router.post("/address/new", authMiddleware, addAddress);

/* update address */
router.put("/address/:addressId", authMiddleware, updateAddress);

/* delete address */
router.delete("/address/:addressId", authMiddleware, deleteAddress);

module.exports = router;
