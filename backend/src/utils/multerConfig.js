const multer = require("multer");
const path = require("path");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../images")); // Use path.join for better compatibility
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Save file with a unique name
  },
});

const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
