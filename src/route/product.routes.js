const productController = require("../controller/product.controller");
const express = require("express");

const router = express.Router();

router.post("/all", productController.getProducts);
router.get("/fetch-active", productController.fetchActiveProducts);
router.post(
  "/delete",
  productController.validate("singleProduct"),
  productController.deleteProduct
);
router.post(
  "/get",
  productController.validate("singleProduct"),
  productController.getProductById
);
router.post(
  "/save",
  productController.validate("saveProduct"),
  productController.saveProduct
);

module.exports = router;
