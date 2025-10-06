'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stk_detail', {
      ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      STK_Main_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stk_main',  // <--- lowercase table name
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
          model: 'zitems',   // already lowercase
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      batchno: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Batch number for this item'
      },
      Stock_Price: { type: Sequelize.DECIMAL(10, 2) },
      Stock_SKU_Price: { type: Sequelize.DECIMAL(10, 2) },

      Stock_In_UOM: { type: Sequelize.INTEGER },
      Stock_In_UOM_Qty: { type: Sequelize.DECIMAL(10, 3) },
      Stock_out_UOM: { type: Sequelize.INTEGER },
      Stock_out_UOM_Qty: { type: Sequelize.DECIMAL(10, 3) },

      Stock_In_SKU_UOM: { type: Sequelize.INTEGER },
      Stock_In_SKU_UOM_Qty: { type: Sequelize.DECIMAL(10, 3) },
      Stock_out_SKU_UOM: { type: Sequelize.INTEGER },
      Stock_out_SKU_UOM_Qty: { type: Sequelize.DECIMAL(10, 3) },

      Stock_In_UOM3_Qty: { type: Sequelize.DECIMAL(10, 3) },
      Stock_out_UOM3_Qty: { type: Sequelize.DECIMAL(10, 3) },

      Sale_Unit: { type: Sequelize.STRING },

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

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Composite unique index (use lowercase table name)
    await queryInterface.addIndex('stk_detail', ['STK_Main_ID', 'Line_Id'], {
      unique: true,
      name: 'stk_detail_main_line_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stk_detail');
  }
};
