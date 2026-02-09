// migrations/XXXXXX-create-lc-main-table.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lcmain', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      lcId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,  // ✅ UNIQUE constraint
        references: {
          model: 'zcoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      shipperId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zmasterTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      consigneeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zmasterTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      bankNameId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zmasterTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      contactTypeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zmasterTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      bl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Bill of Lading'
      },
      container: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      // ✅ REMOVED: noOfContainer
      containerCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Container count (up to 2 digits)'
      },
      containerSize: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Container size'
      },
      inv: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Invoice'
      },
      currencyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zcurrencies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Amount (e.g., 300$ or 1000pkr)'
      },
      clearingAgentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zmasterTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      gd: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'GD Number'
      },
      gdDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      exchangeRateDuty: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: 0
      },
      exchangeRateDocuments: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: 0
      },
      totalExp: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      averageDollarRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      paymentDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      itemDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // ✅ ADDED: landedCost
      landedCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Landed Cost'
      },
      status: {
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

    // Add indexes
    await queryInterface.addIndex('lcmain', ['lcId'], { unique: true });
    await queryInterface.addIndex('lcmain', ['shipperId']);
    await queryInterface.addIndex('lcmain', ['consigneeId']);
    await queryInterface.addIndex('lcmain', ['bankNameId']);
    await queryInterface.addIndex('lcmain', ['contactTypeId']);
    await queryInterface.addIndex('lcmain', ['clearingAgentId']);
    await queryInterface.addIndex('lcmain', ['currencyId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lcmain');
  }
};
