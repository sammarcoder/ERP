const express = require('express');
const router = express.Router();
const {
    createZcurrency,
    getAllZcurrencies,
    getZcurrencyById,
    updateZcurrency,
    deleteZcurrency
} = require('../controllers/zcurrencyController');

router.post("/create", createZcurrency);
router.get("/get", getAllZcurrencies);
router.get("/get/:id", getZcurrencyById);
router.put("/put/:id", updateZcurrency);
router.delete("/delete/:id", deleteZcurrency);

module.exports = router;















``



















// const express = require('express');
// const router = express.Router();
// const { auth } = require('express-oauth2-jwt-bearer');
// const {
//     createZcurrency,
//     getAllZcurrencies,
//     getZcurrencyById,
//     updateZcurrency,
//     deleteZcurrency
// } = require('../controllers/zcurrencyController');

// // ✅ JWT validation middleware
// const jwtCheck = auth({
//   audience: 'ERP-integerate',
//   issuerBaseURL: 'http://localhost:8080/realms/ERP',
//   tokenSigningAlg: 'RS256'
// });

// // ✅ Permission checking middleware
// const hasPermission = (requiredPermission) => {
//   return (req, res, next) => {
//     try {
//       const payload = req.auth.payload;
      
//       // Get all user roles
//       const realmRoles = payload.realm_access?.roles || [];
//       const clientRoles = payload.resource_access?.['ERP-integerate']?.roles || [];
//       const allRoles = [...realmRoles, ...clientRoles];
      
//       console.log('🔍 Permission Check:', {
//         endpoint: req.originalUrl,
//         method: req.method,
//         user: payload.email,
//         requiredPermission,
//         userRoles: allRoles
//       });
      
//       // Permission mapping
//       const permissions = {
//         'currency-viewer': ['currency:read'],
//         'currency-editor': ['currency:read', 'currency:write'], 
//         'currency-manager': ['currency:read', 'currency:write', 'currency:delete'],
//         'User': ['currency:read'],
//         'admin': ['currency:read', 'currency:write', 'currency:delete'],
//         'default-roles-erp': ['currency:read'] // Default Keycloak role
//       };
      
//       // Check if user has permission
//       const hasAccess = allRoles.some(role => 
//         permissions[role]?.includes(requiredPermission)
//       );
      
//       if (hasAccess) {
//         console.log(`✅ Permission "${requiredPermission}" granted`);
//         req.userRoles = allRoles;
//         req.userInfo = {
//           id: payload.sub,
//           email: payload.email,
//           name: payload.name
//         };
//         next();
//       } else {
//         console.log(`❌ Permission "${requiredPermission}" denied`);
//         return res.status(403).json({ 
//           success: false,
//           error: 'Insufficient permissions',
//           required: requiredPermission,
//           userRoles: allRoles 
//         });
//       }
//     } catch (error) {
//       console.error('Permission check error:', error);
//       return res.status(500).json({
//         success: false,
//         error: 'Permission validation failed'
//       });
//     }
//   };
// };

// // ✅ Debug middleware to see incoming requests
// const debugRequest = (req, res, next) => {
//   console.log('🔍 Incoming Request:', {
//     method: req.method,
//     url: req.originalUrl,
//     hasAuthHeader: !!req.headers.authorization,
//     authHeaderPreview: req.headers.authorization?.substring(0, 30) + '...',
//     timestamp: new Date().toISOString()
//   });
//   next();
// };

// // ✅ Apply middlewares
// router.use(debugRequest);  // Debug first
// router.use(jwtCheck);      // Then validate JWT

// // ✅ Your existing routes with permission checks
// router.post("/create", hasPermission('currency:write'), createZcurrency);
// router.get("/get", hasPermission('currency:read'), getAllZcurrencies);
// router.get("/get/:id", hasPermission('currency:read'), getZcurrencyById);
// router.put("/put/:id", hasPermission('currency:write'), updateZcurrency);
// router.delete("/delete/:id", hasPermission('currency:delete'), deleteZcurrency);

// // ✅ Error handling middleware for this router
// router.use((err, req, res, next) => {
//   console.log('=== CURRENCY ROUTE ERROR ===');
//   console.log('Error Name:', err.name);
//   console.log('Error Message:', err.message);
//   console.log('Request URL:', req.originalUrl);
  
//   if (err.name === 'UnauthorizedError') {
//     return res.status(401).json({
//       success: false,
//       error: 'Authentication required',
//       message: 'Invalid or missing JWT token',
//       details: err.message
//     });
//   }
  
//   res.status(500).json({
//     success: false,
//     error: 'Internal server error',
//     message: err.message
//   });
// });

// module.exports = router;































// const express = require('express');
// const router = express.Router();
// const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

// const {
//     createZcurrency,
//     getAllZcurrencies,
//     getZcurrencyById,
//     updateZcurrency,
//     deleteZcurrency
// } = require('../controllers/zcurrencyController');

// // JWT Authentication middleware
// const jwtCheck = auth({
//     audience: 'https://erp-system-api.com',
//     issuerBaseURL: 'https://dev-a0cs34r4yfdojlup.au.auth0.com/',
//     tokenSigningAlg: 'RS256'
// });

// // ✅ FIXED: Middleware to format permissions for express-oauth2-jwt-bearer
// const formatPermissionsForMiddleware = (req, res, next) => {
//     console.log('=== JWT DEBUG INFO ===');
//     console.log('Request URL:', req.method, req.originalUrl);
//     console.log('Authorization Header:', req.headers.authorization ? 'Present' : 'Missing');
    
//     if (req.auth) {
//         console.log('✅ JWT Token Decoded Successfully');
        
//         const payload = req.auth.payload || req.auth;
        
//         console.log('User Sub:', payload.sub);
//         console.log('Token Audience:', payload.aud);
//         console.log('Token Issuer:', payload.iss);
        
//         // Extract roles and permissions
//         const roles = payload['https://erp-system-api.com/roles'] || [];
//         const permissions = payload['permissions'] || payload['https://erp-system-api.com/permissions'] || [];
        
//         console.log('🔑 User Roles:', JSON.stringify(roles));
//         console.log('🔑 User Permissions:', JSON.stringify(permissions));
        
//         // Check specific permissions
//         const hasReadPermission = permissions.includes('currency:read');
//         const hasWritePermission = permissions.includes('currency:write');
//         const hasDeletePermission = permissions.includes('currency:delete');
        
//         console.log('Permission Checks:');
//         console.log('  - currency:read:', hasReadPermission ? '✅ YES' : '❌ NO');
//         console.log('  - currency:write:', hasWritePermission ? '✅ YES' : '❌ NO');
//         console.log('  - currency:delete:', hasDeletePermission ? '✅ YES' : '❌ NO');
        
//         // ✅ CRITICAL FIX: Set permissions in the format express-oauth2-jwt-bearer expects
//         if (permissions.length > 0) {
//             // Method 1: Set in payload.scope (space-separated string)
//             req.auth.payload.scope = req.auth.payload.scope + ' ' + permissions.join(' ');
            
//             // Method 2: Set in multiple locations for compatibility
//             req.auth.permissions = permissions;
//             req.auth.scopes = permissions;
            
//             // Method 3: Ensure permissions are available for the middleware
//             req.permissions = permissions;
            
//             console.log('✅ Updated scope:', req.auth.payload.scope);
//             console.log('✅ Set multiple permission formats for middleware compatibility');
//         }
//     } else {
//         console.log('❌ No JWT token found in request');
//     }
//     console.log('======================');
    
//     next();
// };

// // Apply authentication to all routes
// router.use(jwtCheck);

// // ✅ Add permission formatting middleware
// router.use(formatPermissionsForMiddleware);

// // ✅ Alternative: Custom permission check instead of requiredScopes
// const checkPermission = (permission) => {
//     return (req, res, next) => {
//         const payload = req.auth?.payload || req.auth;
//         const permissions = payload?.['permissions'] || payload?.['https://erp-system-api.com/permissions'] || [];
        
//         console.log(`🔍 Custom permission check for "${permission}"`);
//         console.log('Available permissions:', permissions);
        
//         if (permissions.includes(permission)) {
//             console.log(`✅ Permission "${permission}" granted`);
//             next();
//         } else {
//             console.log(`❌ Permission "${permission}" denied`);
//             return res.status(403).json({
//                 success: false,
//                 error: 'Insufficient permissions',
//                 message: `Required permission: ${permission}`,
//                 userPermissions: permissions
//             });
//         }
//     };
// };

// // ✅ OPTION 1: Try requiredScopes with updated format
// router.post("/create", requiredScopes('currency:write'), (req, res, next) => {
//     console.log('🎯 CREATE endpoint hit - currency:write permission verified');
//     createZcurrency(req, res, next);
// });

// router.get("/get", requiredScopes('currency:read'), (req, res, next) => {
//     console.log('🎯 GET ALL endpoint hit - currency:read permission verified');
//     getAllZcurrencies(req, res, next);
// });

// // ✅ OPTION 2: Alternative routes using custom permission check
// // Uncomment these if requiredScopes still doesn't work:

// // router.post("/create", checkPermission('currency:write'), (req, res, next) => {
// //     console.log('🎯 CREATE endpoint hit - currency:write permission verified');
// //     createZcurrency(req, res, next);
// // });

// // router.get("/get", checkPermission('currency:read'), (req, res, next) => {
// //     console.log('🎯 GET ALL endpoint hit - currency:read permission verified');
// //     getAllZcurrencies(req, res, next);
// // });

// router.get("/get/:id", requiredScopes('currency:read'), (req, res, next) => {
//     console.log('🎯 GET BY ID endpoint hit - currency:read permission verified');
//     getZcurrencyById(req, res, next);
// });

// router.put("/put/:id", requiredScopes('currency:write'), (req, res, next) => {
//     console.log('🎯 UPDATE endpoint hit - currency:write permission verified');
//     updateZcurrency(req, res, next);
// });

// router.delete("/delete/:id", requiredScopes('currency:delete'), (req, res, next) => {
//     console.log('🎯 DELETE endpoint hit - currency:delete permission verified');
//     deleteZcurrency(req, res, next);
// });

// // Error handling middleware
// router.use((err, req, res, next) => {
//     console.log('=== CURRENCY ROUTE ERROR ===');
//     console.log('Error Name:', err.name);
//     console.log('Error Message:', err.message);
//     console.log('Error Status:', err.status);
//     console.log('Full Error:', err);
    
//     if (err.name === 'UnauthorizedError') {
//         console.log('❌ JWT Authentication Failed');
//         return res.status(401).json({
//             success: false,
//             error: 'Authentication required',
//             message: 'Invalid or missing JWT token'
//         });
//     }
    
//     if (err.name === 'InsufficientScopeError') {
//         console.log('❌ Permission Check Failed');
//         console.log('Required Scopes:', err.expected_scopes);
//         console.log('User Scopes:', err.scopes);
//         console.log('Available Permissions from req.auth:', req.auth?.permissions);
//         console.log('Available Permissions from payload:', req.auth?.payload?.permissions);
        
//         return res.status(403).json({
//             success: false,
//             error: 'Insufficient permissions',
//             message: `Required permission: ${err.expected_scopes?.join(', ')}`,
//             userPermissions: req.auth?.permissions || req.auth?.payload?.permissions
//         });
//     }
    
//     console.log('============================');
//     next(err);
// });

// module.exports = router;
