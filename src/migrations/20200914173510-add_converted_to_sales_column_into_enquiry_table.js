'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "enquiry",
        "converted_to_sales",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('enquiry', 'converted_to_sales')
    ]);
  }
};
