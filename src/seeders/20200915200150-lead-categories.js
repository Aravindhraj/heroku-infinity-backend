"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const types = ["hot leads", "Warm lead"];
    await queryInterface.bulkInsert(
      "lead_categories",
      types.map((name, index) => ({
        id: index + 1,
        name,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }))
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("lead_categories", null, {});
  },
};
