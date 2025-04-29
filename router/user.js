const router = require("express").Router();
const user = require("../controllers/signup");
const login = require("../controllers/login");
const { changePassword } = require("../controllers/change-password");
const authMiddleware = require("../controllers/refresh-token");
const {
  sendOtpFornewpassword,
  newPassword,
} = require("../controllers/reset-password");

router.post("/register", user.register);
router.post("/verify", user.verifyOtp);
router.post("/login", login.login);
router.post("/verify-otp", sendOtpFornewpassword); // for new otp verification
router.post("/new-password", newPassword); // new password added
router.post("/change-password", authMiddleware, changePassword);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

module.exports = router;
