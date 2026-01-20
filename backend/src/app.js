// const express = require('express')
// const morgan = require('morgan')
// const cors = require('cors')


// const app = express()
// const sequelize = require ('../config/database')

// app.use(morgan('dev'))
// app.use(express.json()) 
// app.use(cors())

// app.get('/api', (req, res) => {
//   res.json({ name: "saamr" })
// })

// // MOVE ROUTES BEFORE ERROR MIDDLEWARE
// app.use('/api', require('./routes/index.js'))

// // ENHANCED ERROR LOGGING MIDDLEWARE (Place AFTER routes)
// app.use((err, req, res, next) => {
//   console.error('=== ERROR DETAILS ===');
//   console.error('URL:', req.method, req.originalUrl);
//   console.error('Body:', req.body);
//   console.error('Error Name:', err.name);
//   console.error('Error Message:', err.message);
//   console.error('Full Error:', err);
//   console.error('Stack Trace:', err.stack);
//   console.error('===================');
  
//   // Send detailed error in development
//   const isDevelopment = process.env.NODE_ENV !== 'production';
  
//   res.status(err.status || 500).json({
//     success: false,
//     error: isDevelopment ? err.message : 'Something went wrong!',
//     details: isDevelopment ? {
//       name: err.name,
//       message: err.message,
//       stack: err.stack
//     } : undefined
//   });
// });

// // BETTER DATABASE INITIALIZATION
// const initDatabase = async () => {
//   try {
//     console.log('🔄 Starting database initialization...');
    
//     await sequelize.authenticate();
//     console.log('✅ Database connected');
    
//     // Disable foreign key checks during sync
//     // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
//     // console.log('⚠️ Foreign key checks disabled');
    
//     await sequelize.sync({alter:true});
//     console.log('✅ Models synced');
    
//     // Re-enable foreign key checks
//     await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
//     console.log('✅ Foreign key checks re-enabled');
    
//   } catch (err) {
//     console.error('❌ Database initialization error:');
//     console.error('Error Name:', err.name);
//     console.error('Error Message:', err.message);
//     console.error('Full Error:', err);
    
//     // Try to re-enable foreign key checks even on error
//     try {
//       await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
//     } catch (e) {
//       console.error('Failed to re-enable foreign key checks');
//     }
    
//     process.exit(1);
//   }
// };

// const PORT = process.env.PORT || 4000;

// // START SERVER WITH PROPER ERROR HANDLING
// initDatabase().then(() => {
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//     console.log(`📍 COA API: http://localhost:${PORT}/api/z-coa/create`);
//   });
// }).catch(err => {
//   console.error('Failed to start server:', err);
//   process.exit(1);
// });















































const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('../config/database');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
  res.json({ name: "sammar" });
});

app.use('/api', require('./routes/index.js'));

app.use((err, req, res, next) => {
  console.error('=== ERROR DETAILS ===');
  console.error('URL:', req.method, req.originalUrl);
  console.error('Body:', req.body);
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Full Error:', err);
  console.error('Stack Trace:', err.stack);
  console.error('===================');

  const isDevelopment = process.env.NODE_ENV !== 'production';

  res.status(err.status || 500).json({
    success: false,
    error: isDevelopment ? err.message : 'Something went wrong!',
    details: isDevelopment ? {
      name: err.name,
      message: err.message,
      stack: err.stack
    } : undefined
  });
});

const NODE_ENV = process.env.NODE_ENV || 'development';
const DEFAULT_PORT = NODE_ENV === 'test' ? 4001 : 4000;
const PORT = process.env.PORT || DEFAULT_PORT;

// Replaced initDatabase with initServer
const initServer = async () => {
  try {
    console.log('🔄 Starting server initialization...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful. Ready to start the server.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
      console.log(`📍 COA API: http://localhost:${PORT}/api/z-coa/create`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to the database or start the server.');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    process.exit(1);
  }
};

initServer();



































































// const express = require('express')
// const morgan = require('morgan')
// const cors = require('cors')

// // const coaController = require('./controllers/coa.controller.js')
// const {JournalDetail} = require('./models/JournalDetail.model.js')

// const app = express()

// const sequelize = require ('../config/database')
// app.use(morgan('dev')) // Logging middleware
// app.use(express.json()) // Body parser for JSON
// app.use(cors())
// app.get('/api', (req, res) => {
//   res.json({ name: "saamr" })
// })

// // app.post('/post2',coaController.createCoa)
// // app.get('/post2',coaController.getCoa)
// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ error: 'Something went wrong!' })
// })
// app.use('/api', require('./routes/index.js'))
// sequelize.authenticate()
//   .then(() => {
//     console.log('✅ Database connected');
//     return sequelize.sync({});
//   })
//   .then(() => {
//     console.log('✅ Models synced');
//   })
//   .catch(err => {
//     console.error('❌ DB connection error:', err);
//   });


// const PORT = process.env.PORT || 4000
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`)
// })




































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
