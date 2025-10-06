'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('zitems', {
      // Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // Item Name
      itemName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      // 1. Foreign Keys for Item Classes (ZClassType)
      itemClass1: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zclasstypes', // Assumed lowercase plural table name
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' 
      },
      itemClass2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zclasstypes',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      itemClass3: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zclasstypes',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      itemClass4: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zclasstypes',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      // 2. UOM Fields (Uom)
      skuUOM: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'uoms', // Assumed lowercase plural table name
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Enforces UOM presence for SKU
      },
      uom1_qyt: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        // Assuming this is not nullable since it has a default value
        allowNull: true // Keeping allowNull: true to be safe, though a default often implies not-null.
      },
      uom2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'uoms',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' 
      },
      uom2_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      uom3: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'uoms',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      uom3_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      assessmentUOM: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'uoms',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      // 3. Product Details
      weight_per_pcs: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      barCode: {
        type: Sequelize.BIGINT,
        allowNull: true
      },

      // 4. Pricing Fields
      sellingPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      purchasePricePKR: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      purchasePriceFC: {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: true
      },
      assessedPrice: {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: true
      },

      // 5. Duty Structure
      hsCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cd: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      ftaCd: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      acd: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      rd: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      salesTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      addSalesTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      itaxImport: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      furtherTax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },

      // 6. Supplier Foreign Key (Assuming Supplier table is 'suppliers' or similar)
      supplier: {
        type: Sequelize.INTEGER,
        allowNull: true
        // NOTE: If you add the Supplier model later, you'll need a migration to ADD FOREIGN KEY.
        // references: { model: 'suppliers', key: 'id' },
        // onDelete: 'SET NULL'
      },

      // 7. Account Foreign Keys (ZCoa)
      purchaseAccount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zcoas', // Assumed lowercase plural table name for ZCoa
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      salesAccount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zcoas',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      salesTaxAccount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zcoas',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      // 8. Boolean Fields
      wastageItem: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isNonInventory: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },

      // 9. Timestamps (Added by model configuration: timestamps: true)
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

  // Down migration: defines how to undo the changes (drop the table)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('zitems');
  }
};