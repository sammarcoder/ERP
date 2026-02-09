'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('zitems', 'incomeTaxWithheld', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('zitems', 'incomeTaxWithheld');
  }
};
