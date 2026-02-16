'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.changeColumn('Stk_main', 'Purchase_Type', {
        type: Sequelize.STRING,
        // type: Sequelize.ENUM('Local', 'Foreign', 'Mfg', 'Local selling'),
        // comment: 'Local/Foreign/Mfg/ Local selling'
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('Stk_main', 'Purchase_Type', {
        type: Sequelize.ENUM('Local', 'Foreign', 'Mfg', 'Local selling'),
        // comment: 'Local/Foreign/Mfg/ Local selling'
    });
  }
};
