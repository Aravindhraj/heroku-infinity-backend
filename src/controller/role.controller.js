const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");

exports.validate = (method) => {
  switch (method) {
    case "createRole":
      return [body("name").notEmpty()];
    case "deleteRole":
      return [
        body("id")
          .notEmpty()
          .withMessage("Id is required")
          .bail()
          .custom((value) => idExists(value, "Roles")),
      ];
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await db.Roles.findAll({
      attributes: ["id", "name"],
    });
    return apiSuccess(res, roles);
  } catch (error) {
    return apiError(res);
  }
};

exports.createRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { name } = req.body;
    const role = await db.Roles.create({ name });
    return apiSuccess(res, role);
  } catch (error) {
    return apiError(res);
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Roles.destroy({ where: { id } });
    return apiSuccess(res);
  } catch (error) {
    return apiError(res);
  }
};
