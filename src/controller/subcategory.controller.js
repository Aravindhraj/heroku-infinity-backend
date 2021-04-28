const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { upload } = require("../helpers/upload.helper");
const express = require("express");
const { idExists } = require("../helpers/validator.helper");
const { Op } = require("sequelize");

const router = express.Router();
exports.validate = (method) => {
  switch (method) {
    case "saveSubcategory":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Subcategories"))
          .withMessage("Subcategory Doesn't Exists"),
        body("category_id")
          .notEmpty()
          .custom((value) => idExists(value, "Categories"))
          .withMessage("Category Doesn't Exists"),
        body("name").notEmpty(),
      ];
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    const categories = await db.Subcategories.findAll({
      attributes: ["id", "name", "image", "icon", "status"],
      include: {
        model: db.Categories,
        as: "category",
        attributes: ["id", "name"],
      },
    });
    return apiSuccess(res, categories);
  } catch (error) {
    return apiError(res, error.message);
  }
};
exports.deleteSubcategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Subcategories.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveSubcategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true, 422);
    }

    const { id, name, icon, status, category_id } = req.body;

    let image = "";
    if (req.files && req.files.image) {
      image = await upload(req.files.image, "subcategories");
      if (!image) {
        return apiError(res, "Server Error");
      }
    } else {
      image = req.body.image;
    }

    const data = { name, icon, status, image, category_id };

    const isDuplicate = await checkDuplicates(id, name, category_id);
    if (isDuplicate) {
      return apiError(res, "Varient name has already been taken.", true);
    }

    if (id) {
      // update
      subcategory = await db.Subcategories.findByPk(id);
      subcategory.update(data);
    } else {
      // create
      await db.Subcategories.create(data);
    }
    return apiSuccess(res, [], "Saved Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getSubCategoriesOptions = async (req, res) => {
  try {
    const subCats = await db.Subcategories.findAll({
      attributes: ["id", "name", "category_id"],
      include: {
        model: db.Categories,
        as: "category",
        attributes: ["id", "name"],
      },
      where: {
        status: {
          [Op.eq]: 1,
        },
      },
    });
    return apiSuccess(res, subCats);
  } catch (error) {
    return apiError(res, error.message);
  }
};

const checkDuplicates = async (id, name, cat_id) => {
  const condition = {
    name: {
      [Op.eq]: name,
    },
    category_id: {
      [Op.eq]: cat_id,
    },
  };

  if (id) {
    condition["id"] = {
      [Op.ne]: id,
    };
  }

  const count = await db.Subcategories.count({
    where: condition,
  });

  return count > 0;
};
