'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn('JournalDetail', 'idCard', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    queryInterface.addColumn('JournalDetail', 'bank', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    queryInterface.addColumn('JournalDetail', 'bankDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('JournalDetail', 'idCard');
    queryInterface.removeColumn('JournalDetail', 'bank');
    queryInterface.removeColumn('JournalDetail', 'bankDate');
  }
};
