'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "users",
        "department_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'department_id')
    ]);
  }
};
