'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ZCoas', 'Transporter_ID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Ztransporter', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Or 'CASCADE', depending on your business logic
    });
    await queryInterface.addColumn('ZCoas','freight_crt',{
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });
    await queryInterface.addColumn('ZCoas','labour_crt',{
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00  
    })
    await queryInterface.addColumn('ZCoas','bility_expense',{
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00  
    })
    await queryInterface.addColumn('ZCoas','other_expense',{
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00  
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ZCoas', 'Transporter_ID');
    await queryInterface.removeColumn('ZCoas', 'freight_crt:');
    await queryInterface.removeColumn('ZCoas', 'labour_crt:');
    await queryInterface.removeColumn('ZCoas', 'bility_expense:');
    await queryInterface.removeColumn('ZCoas', 'other_expense:');
  }
};
