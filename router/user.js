const router = require("express").Router();
const user = require("../controllers/signup");
const login = require("../controllers/login");
const passport = require("../utils/passport");

router.post("/register", user.register);
router.post("/verify", user.verifyOtp);
router.post("/login", login.login);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // If authentication is successful, the user will be in req.user
    console.log("req.user: ", req.user); // yes got body
    res.json({
      message: "This is a protected route",
      user: req.user,
    });
  },
);

module.exports = router;
