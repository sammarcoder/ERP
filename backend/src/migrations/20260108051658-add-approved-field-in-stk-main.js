'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  queryInterface.addColumn('Stk_main', 'approved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Stk_main', 'approved');
  }
};
