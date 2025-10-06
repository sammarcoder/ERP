// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };





















'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JournalMaster', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      stk_Main_ID: {
        type: Sequelize.INTEGER,
        allowNull: true, // You have not specified allowNull: false in your model, so it can be null
        references: {
          model: 'Stk_main', // Assumes a table named 'Stk_mains' for the Stk_main model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Or 'CASCADE', depending on your business logic
      },
      voucherTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZvoucherType', // Assumes a table named 'ZvoucherTypes' for the ZvoucherType model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Or 'CASCADE', depending on your business logic
      },
      voucherNo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      balacingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JournalMasters');
  }
};

