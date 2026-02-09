
// // models/LcMain.js
// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');
// const ZCoa = require('./zCoa.model');
// const Zcurrency = require('./zCurrency.model');
// const ZMasterType = require('./ZMasterType');

// const LcMain = sequelize.define('LcMain', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   lcId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     unique: true,  // ✅ UNIQUE
//     comment: 'Link to ZCoa (LC type only)'
//   },
//   // In LcMain model - add this field
//   gdnId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     unique: true,
//     comment: 'Link to GDN (Stk_main with Stock_Type_ID=12)'
//   },

//   shipperId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     comment: 'Link to ZMasterType (type=1)'
//   },
//   consigneeId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     comment: 'Link to ZMasterType (type=2)'
//   },
//   bankNameId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     comment: 'Link to ZMasterType (type=3)'
//   },
//   contactTypeId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     comment: 'Link to ZMasterType (type=4)'
//   },
//   bl: {
//     type: DataTypes.STRING(255),
//     allowNull: true,
//     comment: 'Bill of Lading'
//   },
//   container: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   // ✅ REMOVED: noOfContainer
//   containerCount: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: 0,
//     comment: 'Container count (up to 2 digits)'
//   },
//   containerSize: {
//     type: DataTypes.STRING(100),
//     allowNull: true,
//     comment: 'Container size'
//   },
//   inv: {
//     type: DataTypes.STRING(255),
//     allowNull: true,
//     comment: 'Invoice'
//   },
//   currencyId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     comment: 'Link to Zcurrency'
//   },
//   amount: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: 0,
//     comment: 'Amount (e.g., 300$ or 1000pkr)'
//   },
//   clearingAgentId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     comment: 'Link to ZMasterType (type=5)'
//   },
//   gd: {
//     type: DataTypes.STRING(255),
//     allowNull: true,
//     comment: 'GD Number'
//   },
//   gdDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: true
//   },
//   exchangeRateDuty: {
//     type: DataTypes.DECIMAL(10, 4),
//     allowNull: true,
//     defaultValue: 0
//   },
//   exchangeRateDocuments: {
//     type: DataTypes.DECIMAL(10, 4),
//     allowNull: true,
//     defaultValue: 0
//   },
//   totalExp: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: 0
//   },
//   averageDollarRate: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: true,
//     defaultValue: 0
//   },
//   paymentDate: {
//     type: DataTypes.DATEONLY,
//     allowNull: true
//   },
//   itemDescription: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   // ✅ ADDED: landedCost
//   landedCost: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: true,
//     defaultValue: 0,
//     comment: 'Landed Cost'
//   },
//   status: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   }
// }, {
//   tableName: 'lcmain',
//   timestamps: true
// });

// // =============================================
// // BELONGS TO (LcMain -> Other Tables)
// // =============================================

// LcMain.belongsTo(ZCoa, {
//   foreignKey: 'lcId',
//   as: 'lc'
// });

// LcMain.belongsTo(ZMasterType, {
//   foreignKey: 'shipperId',
//   as: 'shipper'
// });

// LcMain.belongsTo(ZMasterType, {
//   foreignKey: 'consigneeId',
//   as: 'consignee'
// });

// LcMain.belongsTo(ZMasterType, {
//   foreignKey: 'bankNameId',
//   as: 'bankName'
// });

// LcMain.belongsTo(ZMasterType, {
//   foreignKey: 'contactTypeId',
//   as: 'contactType'
// });

// LcMain.belongsTo(ZMasterType, {
//   foreignKey: 'clearingAgentId',
//   as: 'clearingAgent'
// });

// LcMain.belongsTo(Zcurrency, {
//   foreignKey: 'currencyId',
//   as: 'currency'
// });

// // =============================================
// // HAS MANY (Other Tables -> LcMain)
// // =============================================

// ZCoa.hasMany(LcMain, {
//   foreignKey: 'lcId',
//   as: 'lcMains'
// });

// ZMasterType.hasMany(LcMain, {
//   foreignKey: 'shipperId',
//   as: 'shipperLcMains'
// });

// ZMasterType.hasMany(LcMain, {
//   foreignKey: 'consigneeId',
//   as: 'consigneeLcMains'
// });

// ZMasterType.hasMany(LcMain, {
//   foreignKey: 'bankNameId',
//   as: 'bankNameLcMains'
// });

// ZMasterType.hasMany(LcMain, {
//   foreignKey: 'contactTypeId',
//   as: 'contactTypeLcMains'
// });

// ZMasterType.hasMany(LcMain, {
//   foreignKey: 'clearingAgentId',
//   as: 'clearingAgentLcMains'
// });

// Zcurrency.hasMany(LcMain, {
//   foreignKey: 'currencyId',
//   as: 'lcMains'
// });

// // Add association
// LcMain.belongsTo(Stk_main, {
//   foreignKey: 'gdnId',
//   as: 'gdn'
// });

// Stk_main.hasOne(LcMain, {
//   foreignKey: 'gdnId',
//   as: 'lcMain'
// });


// module.exports = LcMain;









































// models/LcMain.js

const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZCoa = require('./zCoa.model');
const Zcurrency = require('./Zcurrency.model');
const ZMasterType = require('./ZMasterType');
const LcDetail = require('./LcDetail');
const Stk_main = require('./stockMain.model');

const LcMain = sequelize.define('LcMain', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lcId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: 'Link to ZCoa (LC type only)'
  },
  gdnId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    comment: 'Link to GDN (Stk_main with Stock_Type_ID=12)'
  },
  shipperId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to ZMasterType (type=1)'
  },
  consigneeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to ZMasterType (type=2)'
  },
  bankNameId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to ZMasterType (type=3)'
  },
  contactTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to ZMasterType (type=4)'
  },
  bl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Bill of Lading'
  },
  container: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  containerCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  containerSize: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  inv: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Invoice'
  },
  currencyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to Zcurrency'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  clearingAgentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to ZMasterType (type=5)'
  },
  gd: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'GD Number'
  },
  gdDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  exchangeRateDuty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  exchangeRateDocuments: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  totalExp: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  averageDollarRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  itemDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  landedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'lcmain',
  timestamps: true
});

// =============================================
// BELONGS TO
// =============================================

LcMain.belongsTo(ZCoa, {
  foreignKey: 'lcId',
  as: 'lc'
});

LcMain.belongsTo(Stk_main, {
  foreignKey: 'gdnId',
  as: 'gdn'
});

LcMain.belongsTo(ZMasterType, {
  foreignKey: 'shipperId',
  as: 'shipper'
});

LcMain.belongsTo(ZMasterType, {
  foreignKey: 'consigneeId',
  as: 'consignee'
});

LcMain.belongsTo(ZMasterType, {
  foreignKey: 'bankNameId',
  as: 'bankName'
});

LcMain.belongsTo(ZMasterType, {
  foreignKey: 'contactTypeId',
  as: 'contactType'
});

LcMain.belongsTo(ZMasterType, {
  foreignKey: 'clearingAgentId',
  as: 'clearingAgent'
});

LcMain.belongsTo(Zcurrency, {
  foreignKey: 'currencyId',
  as: 'currency'
});

// =============================================
// HAS MANY
// =============================================

LcMain.hasMany(LcDetail, {
  foreignKey: 'lcMainId',
  as: 'details'
});

LcDetail.belongsTo(LcMain, {
  foreignKey: 'lcMainId',
  as: 'lcMain'
});

// =============================================
// REVERSE HAS MANY
// =============================================

ZCoa.hasMany(LcMain, {
  foreignKey: 'lcId',
  as: 'lcMains'
});

Stk_main.hasMany(LcMain, {
  foreignKey: 'gdnId',
  as: 'lcMains'
});

ZMasterType.hasMany(LcMain, {
  foreignKey: 'shipperId',
  as: 'shipperLcMains'
});

ZMasterType.hasMany(LcMain, {
  foreignKey: 'consigneeId',
  as: 'consigneeLcMains'
});

ZMasterType.hasMany(LcMain, {
  foreignKey: 'bankNameId',
  as: 'bankNameLcMains'
});

ZMasterType.hasMany(LcMain, {
  foreignKey: 'contactTypeId',
  as: 'contactTypeLcMains'
});

ZMasterType.hasMany(LcMain, {
  foreignKey: 'clearingAgentId',
  as: 'clearingAgentLcMains'
});

Zcurrency.hasMany(LcMain, {
  foreignKey: 'currencyId',
  as: 'lcMains'
});

module.exports = LcMain;
