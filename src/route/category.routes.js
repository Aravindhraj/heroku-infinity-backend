const categoryController = require("../controller/category.controller");
const express = require("express");

const router = express.Router();

router.get("/all", categoryController.getCategories);
router.post(
  "/save",
  categoryController.validate("saveCategory"),
  categoryController.saveCategory
);
router.post("/delete", categoryController.deleteCategory);
router.get("/options", categoryController.getCategoriesOptions);

module.exports = router;
