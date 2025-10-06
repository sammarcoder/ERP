'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    // Note the lowercase table name: 'zclasstypes'
    await queryInterface.createTable('zclasstypes', { 
      // 1. Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // 2. classId field
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      // 3. className field
      className: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
      
      // 4. Timestamps
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
    // Note the lowercase table name: 'zclasstypes'
    await queryInterface.dropTable('zclasstypes'); 
  }
};