'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "users",
        "mobile",
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        "users",
        "age",
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        "users",
        "address",
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        "users",
        "proof_type",
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        "users",
        "proof_no",
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        "users",
        "status",
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'status'),
      queryInterface.removeColumn('users', 'proof_no'),
      queryInterface.removeColumn('users', 'proof_type'),
      queryInterface.removeColumn('users', 'address'),
      queryInterface.removeColumn('users', 'age'),
      queryInterface.removeColumn('users', 'mobile'),
    ]);
  }
};
