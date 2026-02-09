// migrations/XXXXXX-create-lc-detail-table.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lcdetail', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      lcMainId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lcmain',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ZItems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cd: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Customs Duty'
      },
      acd: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Additional Customs Duty'
      },
      rd: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Regulatory Duty'
      },
      salesTax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      addSalesTax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Additional Sales Tax'
      },
      itaxImport: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Income Tax Import'
      },
      furtherTax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      incomeTaxWithheld: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      assessedPrice: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: true,
        defaultValue: 0
      },
      priceFC: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: true,
        defaultValue: 0,
        comment: 'Purchase Price FC'
      },
      assessedQty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
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

    await queryInterface.addIndex('lcdetail', ['lcMainId']);
    await queryInterface.addIndex('lcdetail', ['itemId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lcdetail');
  }
};
