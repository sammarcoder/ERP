const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

// Use your existing sequelize instance
const sequelize = require('../../config/database');
const Sequelize = require('sequelize'); // Direct import of Sequelize

// FIRST PASS: Load all model definitions
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');
  })
  .forEach(file => {
    console.log(`Loading model file: ${file}`);
    const modelExport = require(path.join(__dirname, file));
    
    // If it's a function with a name property (direct model export)
    if (typeof modelExport === 'function' && modelExport.name) {
      console.log(`Adding model: ${modelExport.name}`);
      db[modelExport.name] = modelExport;
    } 
    // If it's an object with multiple exports
    else if (typeof modelExport === 'object') {
      Object.keys(modelExport).forEach(key => {
        if (modelExport[key] && typeof modelExport[key] === 'function' && modelExport[key].name) {
          console.log(`Adding model from object: ${key}`);
          db[key] = modelExport[key];
        }
      });
    }
  });

console.log('Models loaded:', Object.keys(db));

// SECOND PASS: Now that all models are loaded, set up associations
Object.keys(db).forEach(modelName => {
  console.log(`Setting up associations for ${modelName}`);
  if (db[modelName].associate && typeof db[modelName].associate === 'function') {
    try {
      db[modelName].associate(db);
      console.log(`Successfully set up associations for ${modelName}`);
    } catch (error) {
      console.error(`Error setting up associations for ${modelName}:`, error);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
