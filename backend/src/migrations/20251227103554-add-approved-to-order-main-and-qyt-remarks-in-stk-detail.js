'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Order_Main', 'approved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('stk_main', 'freight_crt', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('stk_main', 'labour_crt', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('stk_main', 'bility_expense', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('stk_main', 'other_expense', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('stk_main', 'booked_crt', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('stk_main', 'remarks', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Stk_Detail', 'sale_Uom', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('Stk_Detail', 'uom1_qty', {
      type: Sequelize.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('Stk_Detail', 'uom2_qty', {
      type: Sequelize.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('Stk_Detail', 'uom3_qty', {
      type: Sequelize.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Order_Main', 'approved');
    await queryInterface.removeColumn('stk_main', 'freight_crt');
    await queryInterface.removeColumn('stk_main', 'labour_crt');
    await queryInterface.removeColumn('stk_main', 'bility_expense');
    await queryInterface.removeColumn('stk_main', 'other_expense');
    await queryInterface.removeColumn('stk_main', 'booked_crt');
    await queryInterface.removeColumn('stk_main', 'remarks');
    await queryInterface.removeColumn('Stk_Detail', 'sale_Uom');
    await queryInterface.removeColumn('Stk_Detail', 'uom1_qty');
    await queryInterface.removeColumn('Stk_Detail', 'uom2_qty');
    await queryInterface.removeColumn('Stk_Detail', 'uom3_qty');
  }
};
