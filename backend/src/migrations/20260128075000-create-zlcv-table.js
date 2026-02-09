// migrations/YYYYMMDDHHMMSS-create-zlcv-table.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zlcv', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      coaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zcoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // defaultValue: null,
        unique: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isCost: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isDb: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index
    await queryInterface.addIndex('zlcv', ['coaId']);
    await queryInterface.addIndex('zlcv', ['isDb']);
    await queryInterface.addIndex('zlcv', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zlcv');
  }
};
