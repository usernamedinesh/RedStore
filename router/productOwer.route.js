const router = require("express").Router();
const {
  handleRequest,
  handleRegister,
  handleLogin,
  handleGetOwner,
  handleRemoveOwner,
} = require("../controllers/productOwner/auth.ower.controller");

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

module.exports = router;
