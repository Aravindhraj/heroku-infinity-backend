const { body, validationResult } = require("express-validator");
const db = require("../models");
const { apiSuccess, apiError } = require("../helpers/response.helper");
const { Op } = require("sequelize");

exports.validate = (method) => {
  switch (method) {
    case "singleRole":
      return [
        body("id")
          .notEmpty()
          .withMessage("Role Id is required")
          .bail()
          .custom((value) => idExists(value, "Roles")),
      ];
    case "editRole":
      return [
        body("role_id")
          .notEmpty()
          .withMessage("Role Id is required")
          .bail()
          .custom((value) => idExists(value, "Roles")),
        body("permissions").isArray(),
      ];
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await db.Roles.findAll({
      where: {
        id: {
          [Op.ne]: 1,
        },
      },
      attributes: ["id", "name"],
    });
    return apiSuccess(res, roles);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await db.Roles.findOne({
      where: { id: req.body.id },
      include: {
        model: db.RolePermissions,
        as: "permissions",
        attributes: [
          "id",
          "role_id",
          "permission_id",
          "create",
          "read",
          "edit",
          "delete",
        ],
      },
    });
    return apiSuccess(res, role);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.editRole = async (req, res) => {
  try {
    // delete existing permissions of role
    const { role_id, permissions } = req.body;
    await db.RolePermissions.destroy({ where: { role_id } });
    const rolePermissions = Object.keys(permissions).map((permission) => {
      return { ...permissions[permission], role_id };
    });
    await db.RolePermissions.bulkCreate(rolePermissions);
    return apiSuccess(res, [], "Role Updated Successfully!", true);
  } catch (error) {
    return apiError(res, error.message);
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await db.Permissions.findAll({
      attributes: ["id", "name"],
    });
    return apiSuccess(res, permissions);
  } catch (error) {
    return apiError(res);
  }
};
