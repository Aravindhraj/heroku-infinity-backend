const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { upload } = require("../helpers/upload.helper");
const { idExists, isDuplicateEntry } = require("../helpers/validator.helper");
const { Op } = require("sequelize");

exports.validate = (method) => {
  switch (method) {
    case "saveCategory":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Categories"))
          .withMessage("Category Doesn't Exists"),
        body("name").notEmpty(),
      ];
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await db.Categories.findAll({
      attributes: ["id", "name", "image", "icon", "status"],
    });
    return apiSuccess(res, categories);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getCategoriesOptions = async (req, res) => {
  try {
    const categories = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        status: {
          [Op.eq]: 1,
        },
      },
    });
    return apiSuccess(res, categories);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Categories.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true, 422);
    }

    const { id, name, icon, status } = req.body;

    let image = "";
    if (req.files && req.files.image) {
      image = await upload(req.files.image, "categories");
      if (!image) {
        return apiError(res, "Server Error");
      }
    } else {
      image = req.body.image;
    }
    const data = { name, icon, status, image };
    const result = await isDuplicateEntry(name, "name", id, "Categories");
    if (result) {
      return apiError(res, "Category name has already been taken.", true);
    }

    if (id) {
      // update
      category = await db.Categories.findByPk(id);
      category.update(data);
    } else {
      // create
      await db.Categories.create(data);
    }
    return apiSuccess(res, [], "Saved Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};
