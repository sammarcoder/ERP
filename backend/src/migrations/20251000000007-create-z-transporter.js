'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Ztransporter', {
      // 1. Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // 2. name (Required)
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      // 3. contactPerson (Nullable)
      contactPerson: {
        type: Sequelize.STRING,
        allowNull: true // Default for fields without allowNull specified
      },
      
      // 4. phone (Nullable)
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // 5. address (Nullable)
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // 6. isActive (Nullable with Default)
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      
      // 7. Timestamps
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
    await queryInterface.dropTable('Ztransporter');
  }
};