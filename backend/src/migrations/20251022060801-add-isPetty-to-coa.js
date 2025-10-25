'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn('ZCoas', 'isPettyCash', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('ZCoas', 'isPettyCash');
  }
};
