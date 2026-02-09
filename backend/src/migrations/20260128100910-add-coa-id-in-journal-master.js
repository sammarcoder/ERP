'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('journalmaster', 'coaId', {  // ✅ Add await
      type: Sequelize.INTEGER,
      allowNull: true,  // ✅ Changed to true (existing rows have no value)
      references: {
        model: 'zcoas', 
        key: 'id', 
      },
      isUnique: true,
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('journalmaster', 'coaId');  // ✅ Add await
  }
};
