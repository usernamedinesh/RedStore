const router = require("express").Router();
const user = require("../controllers/signup");
const login = require("../controllers/login");
const passport = require("../utils/passport");
const authMiddleware = require("../controllers/refresh-token");

router.post("/register", user.register);
router.post("/verify", user.verifyOtp);
router.post("/login", login.login);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

module.exports = router;
