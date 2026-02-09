// migrations/XXXXXX-create-zmaster-types-table.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ZMasterTypes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=Shipper, 2=Carriage, 3=Bank Name, 4=Contact Type, 5=Clearing Agent'
      },
      typeName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      actualName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add index for faster queries by type
    await queryInterface.addIndex('ZMasterTypes', ['type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ZMasterTypes');
  }
};
