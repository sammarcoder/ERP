'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('ZCoas', 'foreign_currency', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ZCoas', 'sub_customer', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ZCoas', 'sub_city', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('ZCoas','str',{
      type : Sequelize.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ZCoas', 'foreign_currency');
    await queryInterface.removeColumn('ZCoas', 'sub_customer');
    await queryInterface.removeColumn('ZCoas', 'sub_city');
    await queryInterface.removeColumn('ZCoas', 'str')
  }
};
