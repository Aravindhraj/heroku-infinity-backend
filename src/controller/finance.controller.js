const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");

exports.validate = (method) => {
  switch (method) {
    case "getById":
      return [
        body("id")
          .notEmpty()
          .withMessage("Invalid Data")
          .bail()
          .custom((value) => idExists(value, "Finance")),
      ];
    case "saveFinance":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Finance"))
          .withMessage("Finance Not Exists"),
        body("name").notEmpty().withMessage("Enter Name"),
        body("provider").notEmpty().withMessage("Enter Provider")
      ];
    case "deleteFinance":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Finance"))
          .withMessage("Finance Not Exists"),
      ];
  }
};


exports.getFinances = async (req, res) => {
  try {
    const users = await db.Finance.findAll({
      attributes: ["id", "name", "provider", "status"]
    });
    return apiSuccess(res, users);
  } catch (error) {
    return apiError(res);
  }
};

exports.saveFinance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiSuccess(res, { success: false, errors: errors["errors"] });
    }
    let data = req.body;
    if (data["id"] && data["id"] !== "" && data["id"] !== null) {
      const finance = await db.Finance.findByPk(data["id"]);
      finance.update(data);
    } else {
      await db.Finance.create(data);
    }
    return apiSuccess(
      res,
      { success: true },
      data["id"] ? "Finance Updated Successfully" : "Finance Added Successfully",
      true
    );
  } catch (error) {
    return apiError(res);
  }
}

exports.getById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors[0]["msg"], true);
    }
    const user = await db.Finance.findOne({
      where: {
        id: req.body.id,
      },
      attributes: ["id", "name", "description", "provider", "status"]
    });
    return apiSuccess(res, user);
  } catch (error) {
    return apiError(res);
  }
}

exports.deleteFinance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, "Invalid Data", true);
    }

    const data = req.body;
    const finance = await db.Finance.findByPk(data["id"]);
    await finance.destroy();
    return apiSuccess(
      res,
      { success: true },
      "Finance Deleted Successfully",
      true
    );
  } catch (error) {
    return apiError(res, error);
  }
}

exports.getActiveFinances = async (req, res) => {
  try {
    const finances = await db.Finance.findAll({
      attributes: ["id", "name", "provider", "status"],
      where: {
        status: {
          [Op.in]: ['1','t'],
        }
      }
    });
    return apiSuccess(res, finances);
  } catch (error) {
    return apiError(res);
  }
};
