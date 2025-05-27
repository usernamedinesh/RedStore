const router = require("express").Router();
const {
  handleRequest,
  handleRegister,
  handleLogin,
  handleGetOwner,
  handleRemoveOwner,
  verifyTokenForOnwer,
} = require("../controllers/productOwner/auth.ower.controller");
const authMiddleware = require("../controllers/refresh-token");

/* owner/request */
router.post("/request", handleRequest);

/* owner/create-account */
router.post("/create-account/:token", handleRegister);

/* owner/login */
router.post("/login", handleLogin);

/*get owner*/
router.get("/", handleGetOwner);

/* remove owner */
router.delete("/remove/:ownerId", handleRemoveOwner);

/* verity owner account for dashboard */
router.post("/verify-token/:token", verifyTokenForOnwer);

module.exports = router;
