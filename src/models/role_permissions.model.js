"use strict";
const { Model } = require("sequelize");
const db = require("./index");

const { Roles } = require("./roles.model");
module.exports = (sequelize, DataTypes) => {
  class Role_permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role_permissions.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Roles,
          key: "id",
        },
      },
      permission_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Permissions,
          key: "id",
        },
      },
      read: DataTypes.BOOLEAN,
      create: DataTypes.BOOLEAN,
      edit: DataTypes.BOOLEAN,
      delete: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "role_permissions",
      modelName: "Role_permissions",
      paranoid: true,
      timestamps: true,
    }
  );
  return Role_permissions;
};
