'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('lcmain', 'gdnId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'stk_main',
        key: 'ID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      comment: 'Link to GDN (Stk_main with Stock_Type_ID=12)'
    });

    await queryInterface.addIndex('lcmain', ['gdnId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index first (safe if it exists), then remove column
    try {
      await queryInterface.removeIndex('lcmain', ['gdnId']);
    } catch (e) {}
    await queryInterface.removeColumn('lcmain', 'gdnId');
  }
};
