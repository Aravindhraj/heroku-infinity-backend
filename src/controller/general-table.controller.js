const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists, isDuplicateEntry } = require("../helpers/validator.helper");
const { Op } = require("sequelize");

exports.validate = (method, model) => {
  switch (method) {
    case "save":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, model))
          .withMessage("Record Doesn't Exists"),
        body("name").notEmpty(),
      ];
  }
};

exports.getAll = async (req, res, model) => {
  try {
    const records = await db[model].findAll({
      attributes: ["id", "name", "status"],
    });
    return apiSuccess(res, records);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getOptions = async (req, res, model) => {
  try {
    const options = await db[model].findAll({
      attributes: ["id", "name"],
      where: {
        status: {
          [Op.in]: ['1','t'],
        },
      },
    });
    return apiSuccess(res, options);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteRecord = async (req, res, model) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db[model].destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveRecord = async (req, res, model) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true, 422);
    }

    const { id, name, status } = req.body;

    const result = await isDuplicateEntry(name, "name", id, model);
    if (result) {
      return apiError(res, "name has already been taken.", true);
    }

    if (id) {
      // update
      const record = await db[model].findByPk(id);
      record.update({ name, status });
    } else {
      // create
      await db[model].create({ name, status });
    }
    return apiSuccess(res, [], "Saved Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};
