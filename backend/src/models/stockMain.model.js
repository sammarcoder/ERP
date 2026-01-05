
// models/Stk_main.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Stk_main = sequelize.define('Stk_main', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Prime Key'
    },
    Stock_Type_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '11=GRN, 12=Dispatch'
    },
    COA_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // comment: 'Foreign key to ZCOA (Supplier/Customer)'
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Auto generated GRN/Dispatch number'
    },
    Status: {
        type: DataTypes.ENUM('Post', 'UnPost'),
        defaultValue: 'UnPost'
    },
    Purchase_Type: {
        type: DataTypes.ENUM('Local', 'Foreign', 'Mfg', 'Local selling'),
        // comment: 'Local/Foreign/Mfg/ Local selling'
    },
    // Purchase_Batchno: {
    //     type: DataTypes.INTEGER,
    //     comment: 'Foreign key to ZCOA for batch reference'
    // },
    Status_Account_Entry: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'True/False for accounting entry status'
    },
    Carriage_ID: {
        type: DataTypes.INTEGER,
        comment: 'Foreign key to ZCOA for carriage account'
    },
    Carriage_Amount: {
        type: DataTypes.DECIMAL(10, 2),
        comment: 'Numeric field for carriage amount'
    },

    Order_Main_ID: {
        type: DataTypes.INTEGER,
        comment: 'Reference to original PO/SO - Need to update Order_main table',
        onDelete: 'RESTRICT',
    },
    is_Voucher_Generated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Transporter_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    freight_crt: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    labour_crt: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    bility_expense: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    other_expense: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    booked_crt: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    tableName: 'Stk_main',
    timestamps: true,



    hooks: {
        // ✅ ADD THIS: Reset order status when stock record is deleted
        afterDestroy: async (stkRecord, options) => {
            try {
                const { Order_Main } = require('./Order_main');
                const orderId = stkRecord.Order_Main_ID;

                // Check if there are any other stock records for this order
                const remainingStockRecords = await Stk_main.count({
                    where: { Order_Main_ID: orderId }
                });

                // If no more stock records exist, reset the order status
                if (remainingStockRecords === 0) {
                    await Order_Main.update({
                        Next_Status: 'Incomplete',
                        is_Note_generated: false
                    }, {
                        where: { ID: orderId }
                    });

                    console.log(`✅ Order ${orderId} status reset: Next_Status='Incomplete', is_Note_generated=false`);
                }
            } catch (error) {
                console.error('❌ Error resetting order status after stock deletion:', error);
                throw error;
            }
        }
    }
});

// Define associations following your pattern
Stk_main.associate = function (models) {
    // Stk_main has many Stk_Detail
    Stk_main.hasMany(models.Stk_Detail, {
        foreignKey: 'STK_Main_ID',
        as: 'details',
        
    });

    // Stk_main belongs to ZvoucherType (stock type)
    Stk_main.belongsTo(models.ZvoucherType, {
        foreignKey: 'Stock_Type_ID',
        as: 'Carriage_account'
    });

    // Stk_main belongs to ZCOA (supplier/customer)
    Stk_main.belongsTo(models.ZCoa, {
        foreignKey: 'COA_ID',
        as: 'account'
    });

    // Stk_main belongs to ZCOA for carriage cost
    Stk_main.belongsTo(models.ZCoa, {
        foreignKey: 'Carriage_ID',
        as: 'carriage_Account'
    });

    // Stk_main belongs to Ztransporter
    Stk_main.belongsTo(models.Ztransporter, {
        foreignKey: 'Transporter_ID',
        as: 'transporter'
    });

    // Stk_main belongs to Order_Main (original order)
    Stk_main.belongsTo(models.Order_Main, {
        foreignKey: 'Order_Main_ID',
        as: 'order'
    });
    Stk_main.hasMany(models.JournalMaster, {
        foreignKey: 'stk_Main_ID',
        as: 'Journal_master'
    });
};

module.exports = Stk_main;
