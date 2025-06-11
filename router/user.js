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
const { uploadToS3, uploadMultipleToS3 } = require("../service/upload_to_s3");

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

router.post(
  "/upload-single",
  upload.single("image"), // 'image' is the field name in your form/FormData
  async (req, res, next) => {
    const file = req.file;

    if (!file) {
      console.warn("[Upload Route] No file uploaded for /upload-single.");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    try {
      // Construct a unique filename for S3
      // Using a user ID (e.g., from req.user.id if authenticated) is highly recommended
      const userId = req.user ? req.user.id : "anonymous";
      const timestamp = Date.now();
      const originalFileName = file.originalname.replace(/\s+/g, "_"); // Replace spaces for cleaner S3 keys

      // Example: profile_pics/user_123/1700000000000-my_profile_pic.jpg
      const folderName = `profile_pics/user_${userId}`; // Dynamic folder per user
      const uniqueS3FileName = `${timestamp}-${originalFileName}`;

      const imageUrl = await uploadToS3(file, uniqueS3FileName, folderName);

      // console.log("[Upload Route] File uploaded to S3. URL:", imageUrl);

      // Respond with the S3/CloudFront URL
      res.json({
        success: true,
        data: {
          url: imageUrl,
          s3Key: `${folderName}/${uniqueS3FileName}`, // Return the S3 key for reference
        },
        message: "File uploaded successfully to S3.",
      });
    } catch (error) {
      console.error("[Upload Route] Error during single file upload:", error);
      // Multer creates a temporary file even if S3 upload fails.
      // The `finally` block in `uploadToS3` should handle its deletion.
      next(error); // Pass error to your Express error handling middleware
    }
  },
);

router.post("/upload-multiple", upload.array("images", 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }

  try {
    // Upload all files to S3
    const cloudFrontUrls = await uploadMultipleToS3(req.files, "profile_pics");

    res.json({
      success: true,
      message: "Files uploaded successfully to S3",
      files: cloudFrontUrls, // These are S3/CloudFront URLs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload files to S3",
      error: error.message,
    });
  }
});

module.exports = router;
