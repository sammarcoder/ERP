'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('zcurrencies', {
      // 1. Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // 2. currencyName
      currencyName: {
        type: Sequelize.STRING(10), // STRING(10) as defined in the model
        allowNull: false
        // Note: The validate: { notEmpty: true } is a model validation, not a DB constraint.
      },
      
      // 3. Timestamps
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
    await queryInterface.dropTable('zcurrencies');
  }
};