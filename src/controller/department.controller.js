const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { idExists } = require("../helpers/validator.helper");
const { Op, Sequelize } = require("sequelize");

exports.validate = (method) => {
  switch (method) {
    case "saveDepartment":
      return [
        body("id")
          .if((value) => value !== "")
          .custom((value) => idExists(value, "Department"))
          .withMessage("Department Doesn't Exists"),
        body("name").notEmpty(),
      ];
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await db.Department.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("users.id")), "count"],
        "id",
        "name",
        "status",
      ],
      include: [
        {
          model: db.User,
          as: "users",
          attributes: [],
        },
      ],
      group: ["id"],
    });
    return apiSuccess(res, departments);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getActiveDepartments = async (req, res) => {
  try {
    const departments = await db.Department.findAll({
      attributes: ["id", "name"],
      where: {
        status: {
          [Op.eq]: 1,
        },
      },
    });
    return apiSuccess(res, departments);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), false, 422);
    }
    const { id } = req.body;
    await db.Department.destroy({ where: { id } });
    return apiSuccess(res, { success: true }, "Deleted Successfully", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.saveDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiError(res, errors.array(), true, 422);
    }

    const { id, name, status } = req.body;

    if (id) {
      // update
      const department = await db.Department.findByPk(id);
      department.update({ name, status });
      return apiSuccess(res, { success: true }, "Updated Successfully", true);
    } else {
      // create
      await db.Department.create({ name, status });
      return apiSuccess(res, { success: true }, "Saved Successfully", true);
    }
  } catch (error) {
    return apiError(res, error.message);
  }
};
