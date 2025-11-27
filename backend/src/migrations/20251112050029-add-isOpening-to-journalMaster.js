'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn('JournalMaster', 'isOpening', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('JournalMaster', 'isOpening');
  }
};
