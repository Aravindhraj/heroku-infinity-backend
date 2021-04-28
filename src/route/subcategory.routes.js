const subcategoryController = require("../controller/subcategory.controller");
const express = require("express");

const router = express.Router();

router.get("/all", subcategoryController.getSubcategories);
router.post(
  "/save",
  subcategoryController.validate("saveSubcategory"),
  subcategoryController.saveSubcategory
);
router.post("/delete", subcategoryController.deleteSubcategory);
router.get("/options", subcategoryController.getSubCategoriesOptions);

module.exports = router;
