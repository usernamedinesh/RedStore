const storage = require("../service/file_upload");
const router = require("express").Router();
const multer = require("multer");
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

/* NOTE: */
/*
 * REMOVE THIS
 *
 */
const upload = multer({ storage });

router.post("/upload-single", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

router.post("/upload-multiple", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded" });
  }

  const uploadedFiles = req.files.map((file) => ({
    filename: file.filename,
    path: `/uploads/${file.filename}`,
  }));

  res.json({
    success: true,
    message: "Files uploaded successfully",
    files: uploadedFiles,
  });
});

module.exports = router;
