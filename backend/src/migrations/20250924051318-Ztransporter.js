'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ztransporter', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contactPerson: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ztransporter');
  }
};



































    // 'use strict';
    // /** @type {import('sequelize-cli').Migration} */
    // module.exports = {
    //   async up(queryInterface, Sequelize) {
    //     // This is the command that will change the column name in your database
    //     await queryInterface.renameColumn('Ztransporter', 'transporterName', 'name');
    //   },

    //   async down(queryInterface, Sequelize) {
    //     // This command reverses the change if you need to rollback
    //     await queryInterface.renameColumn('Ztransporter', 'name', 'transporterName');
    //   }
    // };
    