'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_detail', {
      ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Order_Main_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order_main',
          key: 'ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Line_Id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Item_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'zitems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      Stock_In_UOM: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Stock_In_UOM_Qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      Stock_SKU_Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      Stock_In_SKU_UOM: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Stock_In_SKU_UOM_Qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      Stock_out_UOM: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Stock_out_UOM_Qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      Stock_out_SKU_UOM: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Stock_out_SKU_UOM_Qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      uom1_qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      uom2_qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      uom3_qty: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        defaultValue: 0
      },
      sale_unit: {
        type: Sequelize.STRING(16),
        allowNull: true,
        comment: 'Selected UOM for sale: uom1, uomTwo, uomThree'
      },
      Discount_A: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
      },
      Discount_B: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
      },
      Discount_C: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
      },
      Goods: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      Remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });

    // Add composite unique index
    await queryInterface.addIndex('order_detail', ['Order_Main_Id', 'Line_Id'], {
      unique: true,
      name: 'order_detail_unique_main_line'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_detail');
  }
};
