const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { idExists } = require("../helpers/validator.helper");

exports.validate = (method) => {
  switch (method) {
    case "getUserById":
      return [
        body("id")
          .notEmpty()
          .withMessage("Invalid Data")
          .bail()
          .custom((value) => idExists(value, "User")),
      ];
    case "saveUser":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "User"))
          .withMessage("User Not Exists"),
        body("firstname").notEmpty().withMessage("Enter Firstname"),
        body("lastname").notEmpty().withMessage("Enter Lastname"),
        body("email")
          .notEmpty()
          .withMessage("Enter Email")
          .bail()
          .isEmail()
          .withMessage("Enter Valid Email"),
        body("password")
          .if((value, req) => req.body.id === "")
          .notEmpty()
          .withMessage("Enter Password"),
        body("confirm_password")
          .if((value, req) => req.body.id === "")
          .notEmpty()
          .withMessage("Enter Confirm Password"),
        body("role")
          .notEmpty()
          .withMessage("Select Role")
          .bail()
          .custom((value) => idExists(value, "Roles"))
          .withMessage("Select Valid Role"),
        body("department_id")
          .notEmpty()
          .withMessage("Select Department")
          .bail()
          .custom((value) => idExists(value, "Department"))
          .withMessage("Select Valid Department")
      ];
    case "deleteUser":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "User"))
          .withMessage("User Not Exists"),
      ];
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: {
        id: {
          [Op.ne]: 1,
        },
      },
      attributes: ["id", "firstname", "lastname", "email", "status"],
      include: [
        {
          model: db.Roles,
          as: "roles",
          attributes: ["id", "name"],
        },
      ],
    });
    return apiSuccess(res, users);
  } catch (error) {
    return apiError(res);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors[0]["msg"], true);
    }
    const user = await db.User.findOne({
      where: {
        id: req.body.id,
      },
      attributes: ["id", "firstname", "lastname", "email", "mobile", "address", "age", "status", "proof_type", "proof_no", "department_id"],
      include: {
        model: db.Roles,
        as: "roles",
        attributes: ["id", "name"],
      },
    });
    return apiSuccess(res, user);
  } catch (error) {
    return apiError(res);
  }
};

exports.saveUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiSuccess(res, { success: false, errors: errors["errors"] });
    }

    let data = req.body;
    const user_role = data["role"];
    delete data["confirm_password"];
    delete data["role"];
    let user = null;
    const temp_role = await db.Roles.findByPk(user_role);
    if (data["id"] && data["id"] !== "" && data["id"] !== null) {
      if (data["password"] === "" || data["password"] === null) {
        delete data["password"];
      } else {
        data["password"] = await bcrypt.hash(data["password"], 10);
      }
      user = await db.User.findByPk(data["id"]);
      delete data["id"];
      user.update(data);
      user.removeRoles();
      user.setRoles(temp_role, { destroy: true });
    } else {
      data["password"] = await bcrypt.hash(data["password"], 10);
      user = await db.User.create(data);
      user.addRoles(temp_role);
    }

    return apiSuccess(
      res,
      { success: true },
      data["id"] ? "User Updated Successfully" : "User Added Successfully",
      true
    );
  } catch (error) {
    return apiError(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, "Invalid Data", true);
    }

    const data = req.body;
    const user = await db.User.findByPk(data["id"]);
    await user.destroy();
    return apiSuccess(
      res,
      { success: true },
      "User Deleted Successfully",
      true
    );
  } catch (error) {
    return apiError(res, error);
  }
};

exports.fetchSalesPerson = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "firstname", "lastname"],
      include: {
        model: db.Roles,
        as: "roles",
        attributes: ["id", "name"],
      },
      where: {
        '$roles.name$': {
          [Op.eq]: 'Sales Executive'
        }
      }
    });
    return apiSuccess(res, users);
  } catch (error) {
    return apiError(res, error);
  }
}


exports.fetchUsersByType = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "firstname", "lastname"],
      include: {
        model: db.Roles,
        as: "roles",
        attributes: ["id", "name"],
      },
      where: {
        '$roles.name$': {
          [Op.eq]: req.body.user_type
        }
      }
    });
    return apiSuccess(res, users);
  } catch (error) {
    return apiError(res, error);
  }
}

exports.testMessage = async (req, res) => {
 return "test is success";
}

