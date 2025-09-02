const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// const coaController = require('./controllers/coa.controller.js')
const {JournalDetail} = require('./models/JournalDetail.model.js')

const app = express()

const sequelize = require ('../config/database')
app.use(morgan('dev')) // Logging middleware
app.use(express.json()) // Body parser for JSON
app.use(cors())
app.get('/api', (req, res) => {
  res.json({ name: "saamr" })
})

// app.post('/post2',coaController.createCoa)
// app.get('/post2',coaController.getCoa)
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})
app.use('/api', require('./routes/index.js'))
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Models synced');
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });


const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})




































// // Import required modules
// const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
// const path = require('path');

// // Create Express app
// const app = express();

// // Prevent uncaught exceptions from crashing the server
// process.on('uncaughtException', (err) => {
//   console.error('❌ UNCAUGHT EXCEPTION');
//   console.error(err.name, err.message);
//   console.error(err.stack);
//   // Continue running instead of crashing
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ UNHANDLED REJECTION');
//   console.error('Reason:', reason);
//   // Continue running instead of crashing
// });

// // Apply middlewares
// app.use(morgan('dev')); // Logging middleware
// app.use(express.json()); // Body parser for JSON
// app.use(cors());

// // Basic route for testing
// app.get('/post', (req, res) => {
//   res.json({ name: "saamr" });
// });

// // IMPORTANT: Load API routes BEFORE database initialization
// // This ensures routes are registered even if DB connection is slow
// try {
//   app.use('/api', require('./routes/index.js'));
//   console.log('✅ API routes loaded');
// } catch (routeError) {
//   console.error('❌ Error loading routes:', routeError.message);
//   app.use('/api', (req, res) => {
//     res.status(500).json({ error: 'API routes unavailable' });
//   });
// }

// // Database setup - with safer error handling
// const sequelize = require('../config/database');
// let dbInitialized = false;

// // Setup database connection and sync - now happens after route registration
// async function setupDatabase() {
//   try {
//     // Connect to database
//     await sequelize.authenticate();
//     console.log('✅ Database connected');
    
//     // Gradually re-enabling alter for field changes
//     await sequelize.sync({ alter: true });
//     console.log('✅ Models synced with alter enabled');
    
//     dbInitialized = true;
//     return true;
//   } catch (error) {
//     console.error('❌ Database initialization error:');
//     console.error(error.message);
//     // Log additional details but don't crash
//     if (error.original) {
//       console.error('Original error:', error.original.code, error.original.errno);
//     }
    
//     // Return false but don't throw - let server continue
//     return false;
//   }
// }

// // Initialize database but don't wait for it to complete
// setupDatabase();

// // Generic error handling middleware - must be last middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Express error handler caught:');
//   console.error(err.stack);
//   res.status(500).json({ error: err.message});
// });

// // Route not found handler - must be after all other routes
// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // Start server independently of database status
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

// module.exports = app;
