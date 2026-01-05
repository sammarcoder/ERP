


'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Order_Main columns
    await queryInterface.addColumn('Order_Main', 'Transporter_ID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Ztransporter',
        key: 'id'
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT'  // ✅ Added
    });

    await queryInterface.addColumn('Order_Main', 'freight_crt', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('Order_Main', 'labour_crt', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('Order_Main', 'bility_expense', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('Order_Main', 'other_expense', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('Order_Main', 'foreign_currency', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Order_Main', 'sub_customer', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null  // ✅ Fixed: Changed from false to null
    });

    await queryInterface.addColumn('Order_Main', 'sub_city', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Order_Main', 'str', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Order_Main', 'is_Note_generated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Order_Detail columns  
    await queryInterface.addColumn('Order_Detail', 'Uom_Id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'uoms',  // ✅ Correct table name
        key: 'id'
      },
      onDelete: 'RESTRICT'
    });

    await queryInterface.addColumn('Order_Detail', 'trade', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Order_Main', 'Transporter_ID');
    await queryInterface.removeColumn('Order_Main', 'freight_crt');
    await queryInterface.removeColumn('Order_Main', 'labour_crt');
    await queryInterface.removeColumn('Order_Main', 'bility_expense');
    await queryInterface.removeColumn('Order_Main', 'other_expense');
    await queryInterface.removeColumn('Order_Main', 'foreign_currency');
    await queryInterface.removeColumn('Order_Main', 'sub_customer');
    await queryInterface.removeColumn('Order_Main', 'str');
    await queryInterface.removeColumn('Order_Main', 'sub_city');
    await queryInterface.removeColumn('Order_Main', 'is_Note_generated');
    await queryInterface.removeColumn('Order_Detail', 'Uom_Id');
    await queryInterface.removeColumn('Order_Detail', 'trade');
  }
};
