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
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('JournalDetail', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jmId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'JournalMaster', // Assuming your JournalMaster table is named 'JournalMaster'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lineId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      coaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZCoas', // Match your ZCoa model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      chqNo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      recieptNo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      ownDb: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      ownCr: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      rate: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      amountDb: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      amountCr: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      isCost: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      currencyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zcurrencies', // Match your Zcurrency model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Set to NULL since allowNull is true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('JournalDetail');
  }
};
