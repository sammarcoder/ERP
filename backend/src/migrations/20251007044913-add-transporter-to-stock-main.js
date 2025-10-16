'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Stk_main', 'Transporter_ID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Ztransporter', // Assumes a table named 'Ztransporters' for the Ztransporter model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Or 'CASCADE', depending on your business logic
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Stk_main', 'Transporter_ID');
    
  }
};
