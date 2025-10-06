'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Up migration: defines how to apply the changes (create the table)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('zcoas', {
      // 1. Primary Key
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // 2. acName (Required and Unique)
      acName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      
      // 3. Foreign Key to ZControlHead1 (Nullable)
      ch1Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zcontrolhead1s', // Assumed table name for ZControlHead1
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Allows deletion of Control Head 1 without deleting ZCoa records
      },
      
      // 4. Foreign Key to ZControlHead2 (Nullable)
      ch2Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'zcontrolhead2s', // Assumed table name for ZControlHead2
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      
      // 5. Foreign Key to ZCOAType (Required)
      coaTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'zcoatypes', // Assumed table name for ZCOAType
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Prevents deletion of a COA Type if it's in use
      },
      
      // 6. Basic Info (All Nullable)
      setupName: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      adress: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      city: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      personName: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      mobileNo: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      
      // 7. Tax and Limits
      taxStatus: { 
        type: Sequelize.BOOLEAN, 
        allowNull: true, 
        defaultValue: false 
      },
      ntn: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      cnic: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      salesLimit: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      credit: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      creditDoys: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      salesMan: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      isJvBalance: { 
        type: Sequelize.BOOLEAN, 
        allowNull: true, 
        defaultValue: false 
      },
      
      // 8. Discount Fields (Required, DECIMAL with Default)
      // Note: Model validations (min/max/isDecimal) are application logic, not migrated here.
      discountA: { 
        type: Sequelize.DECIMAL(5,2), 
        allowNull: false, 
        defaultValue: 0.00
      },
      discountB: { 
        type: Sequelize.DECIMAL(5,2), 
        allowNull: false, 
        defaultValue: 0.00
      },
      discountC: { 
        type: Sequelize.DECIMAL(5,2), 
        allowNull: false, 
        defaultValue: 0.00
      },

      // 9. Batch Number
      batch_no: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      
      // 10. Timestamps
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
    await queryInterface.dropTable('zcoas');
  }
};