const { body, validationResult } = require("express-validator");
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
          .custom((value) => idExists(value, "Insurance")),
      ];
    case "saveInsurance":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Insurance"))
          .withMessage("Insurance Not Exists"),
        body("name").notEmpty().withMessage("Enter Name"),
        body("price").notEmpty().withMessage("Enter Price (In INR)"),
        body("validity").notEmpty().withMessage("Enter Validity"),
      ];
    case "deleteInsurance":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Insurance"))
          .withMessage("Insurance Not Exists"),
      ];
  }
};


exports.getInsurances = async (req, res) => {
  try {
    const users = await db.Insurance.findAll({
      attributes: ["id", "name", "price", "validity", "status"]
    });
    return apiSuccess(res, users);
  } catch (error) {
    return apiError(res);
  }
};

exports.saveInsurance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiSuccess(res, { success: false, errors: errors["errors"] });
    }
    let data = req.body;
    if (data["id"] && data["id"] !== "" && data["id"] !== null) {
      const insurance = await db.Insurance.findByPk(data["id"]);
      insurance.update(data);
    } else {
      await db.Insurance.create(data);
    }
    return apiSuccess(
      res,
      { success: true },
      data["id"] ? "Insurance Updated Successfully" : "Insurance Added Successfully",
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
    const user = await db.Insurance.findOne({
      where: {
        id: req.body.id,
      },
      attributes: ["id", "name", "description", "price", "validity", "status"]
    });
    return apiSuccess(res, user);
  } catch (error) {
    return apiError(res);
  }
}

exports.deleteInsurance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, "Invalid Data", true);
    }

    const data = req.body;
    const insurance = await db.Insurance.findByPk(data["id"]);
    await insurance.destroy();
    return apiSuccess(
      res,
      { success: true },
      "Insurance Deleted Successfully",
      true
    );
  } catch (error) {
    return apiError(res, error);
  }
}
