const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uplaod directory");
}

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb: callback funcion provided by Multer
    // First argument error (null if no error)
    // Second destination path
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // same
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const newFilename = file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, newFilename);
  },
});
