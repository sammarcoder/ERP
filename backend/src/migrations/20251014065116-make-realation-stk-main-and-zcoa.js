'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ensure 'batchno' is nullable before adding the constraint
    await queryInterface.changeColumn('stk_detail', 'batchno', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addConstraint('stk_detail', {
      fields: ['batchno'],
      type: 'foreign key',
      name: 'fk_stkdetail_batchno_zcoa', // custom name for the foreign key constraint
      references: {
        table: 'ZCoas',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'CASCADE' based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('stk_detail', 'fk_stkdetail_batchno_zcoa');
  }
};
