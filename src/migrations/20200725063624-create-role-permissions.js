"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("role_permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        allowNull: false,
      },
      permission_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "permissions",
          key: "id",
        },
        allowNull: false,
      },
      read: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      create: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      edit: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("role_permissions");
  },
};
