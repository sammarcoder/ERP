// // src/config/dbInit.js
// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');

// /**
//  * Professional database initialization with field rename handling
//  * @param {Sequelize} sequelize - Sequelize instance
//  * @param {Object} options - Options for initialization
//  */
// async function initializeDatabase(sequelize, options = {}) {
//   const { force = false, alter = true } = options;
  
//   try {
//     // Test connection
//     await sequelize.authenticate();
//     console.log('✅ Database connected');
    
//     // Get current database schema information
//     const schemaFilePath = path.join(__dirname, 'schema-history.json');
//     let previousSchema = {};
    
//     // Load previous schema if exists
//     if (fs.existsSync(schemaFilePath)) {
//       previousSchema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
//     }
    
//     // Get current models and their attributes
//     const currentSchema = {};
//     Object.keys(sequelize.models).forEach(modelName => {
//       const model = sequelize.models[modelName];
//       const attributes = Object.keys(model.rawAttributes).reduce((acc, key) => {
//         acc[key] = model.rawAttributes[key].type.toString();
//         return acc;
//       }, {});
//       currentSchema[model.tableName] = attributes;
//     });
    
//     // Detect renamed fields by comparing attributes
//     const renameOperations = [];
    
//     for (const [tableName, currentFields] of Object.entries(currentSchema)) {
//       const previousFields = previousSchema[tableName] || {};
      
//       // Find missing fields in current schema that exist in previous schema
//       const missingFields = Object.keys(previousFields).filter(
//         oldField => !Object.keys(currentFields).includes(oldField)
//       );
      
//       // Find new fields in current schema that didn't exist in previous schema
//       const newFields = Object.keys(currentFields).filter(
//         newField => !Object.keys(previousFields).includes(newField)
//       );
      
//       // If we have exactly one missing field and one new field, it's likely a rename
//       if (missingFields.length === 1 && newFields.length === 1) {
//         const oldField = missingFields[0];
//         const newField = newFields[0];
        
//         // Only rename if the types are compatible
//         if (previousFields[oldField] === currentFields[newField]) {
//           renameOperations.push({
//             tableName,
//             oldField,
//             newField,
//             dataType: currentFields[newField]
//           });
//         }
//       }
//     }
    
//     // Execute rename operations
//     const dialect = sequelize.getDialect();
//     for (const op of renameOperations) {
//       try {
//         // Check if old column exists
//         const [columns] = await sequelize.query(
//           `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${op.tableName}' AND COLUMN_NAME = '${op.oldField}'`
//         );
        
//         if (columns.length > 0) {
//           console.log(`Renaming column ${op.oldField} to ${op.newField} in ${op.tableName}`);
          
//           // Execute rename based on dialect
//           switch (dialect) {
//             case 'mysql':
//             case 'mariadb':
//               await sequelize.query(
//                 `ALTER TABLE \`${op.tableName}\` CHANGE COLUMN \`${op.oldField}\` \`${op.newField}\` ${op.dataType}`
//               );
//               break;
//             case 'postgres':
//               await sequelize.query(
//                 `ALTER TABLE "${op.tableName}" RENAME COLUMN "${op.oldField}" TO "${op.newField}"`
//               );
//               break;
//             case 'sqlite':
//               await sequelize.query(
//                 `ALTER TABLE "${op.tableName}" RENAME COLUMN "${op.oldField}" TO "${op.newField}"`
//               );
//               break;
//             default:
//               console.warn(`Column rename not supported for dialect: ${dialect}`);
//           }
//         }
//       } catch (error) {
//         console.error(`Error renaming column in ${op.tableName}:`, error);
//       }
//     }
    
//     // Save current schema for future comparisons
//     fs.writeFileSync(schemaFilePath, JSON.stringify(currentSchema, null, 2));
    
//     // Run sync to handle other changes
//     await sequelize.sync({ force, alter });
//     console.log('✅ Models synced with field renames preserved');
    
//     return true;
//   } catch (error) {
//     console.error('❌ DB initialization error:', error);
//     throw error;
//   }
// }

// module.exports = { initializeDatabase };
