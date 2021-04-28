'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("insurance", "description", { type: Sequelize.TEXT, allowNull: true })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("insurance", "description", { type: Sequelize.STRING, allowNull: true })
  }
};
