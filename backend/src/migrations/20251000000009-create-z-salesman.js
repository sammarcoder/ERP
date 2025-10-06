'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('zsalesmans', {
      // 1. Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // 2. name (Required)
      name: {
        type: Sequelize.STRING(45),
        allowNull: false
        // Note: The validate: { notEmpty: true } is a model validation, not a DB constraint.
      },
      
      // 3. city (Required)
      city: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      
      // 4. adress (Required, Note: Typo 'adress' maintained from the model)
      adress: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      
      // 5. telephone (Required)
      telephone: {
        type: Sequelize.STRING(15),
        allowNull: false
        // Note: The 'is: /^[0-9]+$/' validation is application logic and cannot be easily enforced as a standard DB constraint.
      },
      
      // 6. Timestamps
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
    await queryInterface.dropTable('zsalesmans');
  }
};