'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "sales_lead",
        "document",
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sales_lead', 'document')
    ]);
  }
};
