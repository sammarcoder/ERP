'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('zcontrolhead2s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      zHead2: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zHead1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // *** FOREIGN KEY CONSTRAINT to zcontrolhead1s ***
        references: {
            model: 'zcontrolhead1s', // Table ZControlHead1
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // If Head 1 is deleted, dependent Head 2 records should also be deleted
      },
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('zcontrolhead2s');
  }
};