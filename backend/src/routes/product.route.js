const express = require("express");
const upload = require("../utils/multerConfig"); // Import multer config

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("../controllers/product.controller");
// const { verifyToken } = require("../middleware/verifyToken.middleware");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProductById);
router.delete("/:id", deleteProductById);

module.exports = router;
