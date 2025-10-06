'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('uoms', {
      // 1. Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // 2. uom field (Unit of Measure Name)
      uom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      // 3. Timestamps (Added by model configuration: timestamps: true)
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  // Down migration: defines how to undo the changes (drop the table)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('uoms');
  }
};