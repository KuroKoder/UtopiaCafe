const Product = require("../models/product.model");
const path = require("path");
const fs = require("fs");
const { MY_BE_ONLINE } = require("../utils/constant");

// Fungsi untuk mendapatkan semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const productsWithImageURL = products.map((product) => ({
      ...product.dataValues,
      image: `${MY_BE_ONLINE}/images/${product.image}`,
    }));
    res.status(200).json({
      status: 200,
      success: true,
      message: "ok",
      data: productsWithImageURL, // This should be an array
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

// Fungsi untuk mendapatkan produk berdasarkan ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "product not found",
        data: null,
        error: "Product Not Found",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "ok",
      data: product,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

// Fungsi untuk membuat produk baru
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file ? req.file.filename : null; // Get image filename from multer

    const product = await Product.create({ name, price, image });
    res.status(201).json({
      status: 201,
      success: true,
      message: "new product created",
      data: product,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

// Fungsi untuk memperbarui produk berdasarkan ID
exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const image = req.file ? req.file.filename : null; // Get image filename from multer

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "product not found",
        data: null,
        error: "Product Not Found",
      });
    }
    product.name = name;
    product.price = price;
    if (image) {
      // Delete old image if exists
      if (product.image && fs.existsSync(path.join("uploads", product.image))) {
        fs.unlinkSync(path.join("uploads", product.image));
      }
      product.image = image;
    }
    await product.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "product updated",
      data: product,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

// Fungsi untuk menghapus produk berdasarkan ID
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "product not found",
        data: null,
        error: "Product Not Found",
      });
    }
    // Delete image if exists
    if (product.image && fs.existsSync(path.join("uploads", product.image))) {
      fs.unlinkSync(path.join("uploads", product.image));
    }
    await product.destroy();
    res.status(200).json({
      status: 200,
      success: true,
      message: "product deleted",
      data: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};
