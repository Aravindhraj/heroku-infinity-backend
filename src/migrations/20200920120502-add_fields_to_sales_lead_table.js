'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "sales_lead",
        "payment_type_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "payment_types",
            key: "id",
          },
        }
      ),
      queryInterface.addColumn(
        "sales_lead",
        "finance_type_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "finance",
            key: "id",
          },
        }
      ),
      queryInterface.addColumn(
        "sales_lead",
        "lead_type_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "lead_types",
            key: "id",
          },
        }
      ),
      queryInterface.addColumn(
        "sales_lead",
        "lead_category_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "lead_categories",
            key: "id",
          },
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sales_lead', 'lead_category_id'),
      queryInterface.removeColumn('sales_lead', 'lead_type_id'),
      queryInterface.removeColumn('sales_lead', 'finance_type_id'),
      queryInterface.removeColumn('sales_lead', 'payment_type_id')
    ]);
  }
};
