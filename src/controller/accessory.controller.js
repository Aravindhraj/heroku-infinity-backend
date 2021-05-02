const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { upload } = require("../helpers/upload.helper");
const { idExists, isDuplicateEntry } = require("../helpers/validator.helper");
const { Op } = require("sequelize");

exports.validate = (method) => {
  switch (method) {
    case "saveAccessory":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Accessories"))
          .withMessage("Accessory Doesn't Exists"),
        body("name").notEmpty(),
        body("price").notEmpty(),
      ];
  }
};

exports.getAccessories = async (req, res) => {
  try {
    const accessories = await db.Accessories.findAll({
      attributes: ["id", "name", "price", "status"],
    });
    return apiSuccess(res, accessories);
  } catch (error) {
    return apiError(res, error.message);
  }
};


exports.getAccessoriesByIds = async (req, res) => {
  const { inIDs } = req.body;
  const inIDSArray = inIDs.split(",");
  try {
    const accessories = await db.Accessories.findAll({
      attributes: ["id", "name", "price", "status"],
      where :{
          id:inIDSArray
      }
    });
    return apiSuccess(res, accessories);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getAccessoriesOptions = async (req, res) => {
  try {
    const accessories = await db.Accessories.findAll({
      attributes: ["id", "name", "price"],
      where: {
        status: {
          [Op.in]: ['1','t'],
        },
      },
    });
    return apiSuccess(res, accessories);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteAccessory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Accessories.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveAccessory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true, 422);
    }

    const data = req.body;
    const { name, id } = req.body;
    const result = await isDuplicateEntry(name, "name", id, "Accessories");
    if (result) {
      return apiError(res, "Accessory name has already been taken.", true);
    }

    if (id) {
      // update
      accessory = await db.Accessories.findByPk(id);
      accessory.update(data);
    } else {
      // create
      await db.Accessories.create(data);
    }
    return apiSuccess(res, [], "Saved Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};
