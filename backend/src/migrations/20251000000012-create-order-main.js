'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_main', {
      ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Stock_Type_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '11=Purchase Order, 12=Sales Order',
        references: {
          model: 'zvouchertype', // referenced table
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      COA_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zcoas', // referenced table
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Next_Status: {
        type: Sequelize.ENUM('Incomplete', 'Complete', 'Partial'),
        allowNull: false,
        defaultValue: 'Incomplete'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_main');
  }
};
