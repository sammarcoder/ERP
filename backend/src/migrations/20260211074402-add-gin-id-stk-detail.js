'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn('stk_detail', 'gin_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'zginmain',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('stk_detail', 'gin_id');
  }
};
