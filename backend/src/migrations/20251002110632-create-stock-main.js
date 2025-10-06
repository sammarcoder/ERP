'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stk_main', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Primary Key'
      },
      Stock_Type_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '11=GRN, 12=Dispatch',
        references: { model: 'zvouchertype', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      COA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'zcoas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Auto generated GRN/Dispatch number'
      },
      Status: {
        type: Sequelize.ENUM('Post', 'UnPost'),
        defaultValue: 'UnPost'
      },
      Purchase_Type: {
        type: Sequelize.ENUM('Local', 'Foreign', 'Mfg', 'Local selling')
      },
      Status_Account_Entry: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'True/False for accounting entry status'
      },
      Carriage_ID: {
        type: Sequelize.INTEGER,
        references: { model: 'zcoas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Carriage_Amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      Order_Main_ID: {
        type: Sequelize.INTEGER,
        references: { model: 'order_main', key: 'ID' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_Voucher_Generated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stk_main');
  }
};
