// // const { auth } = require('express-oauth2-jwt-bearer');

// // // ✅ JWT verification middleware
// // const jwtCheck = auth({
// //   audience: 'ERP-integerate',
// //   issuerBaseURL: 'http://localhost:8080/realms/ERP',
// //   tokenSigningAlg: 'RS256'
// // });

// // // ✅ Simple permission checker
// // const hasPermission = (requiredPermission) => {
// //   return (req, res, next) => {
// //     const payload = req.auth.payload;
    
// //     // Get all user roles
// //     const realmRoles = payload.realm_access?.roles || [];
// //     const clientRoles = payload.resource_access?.['ERP-integerate']?.roles || [];
// //     const allRoles = [...realmRoles, ...clientRoles];
    
// //     // Simple role-to-permission mapping
// //     const permissions = {
// //       'currency-viewer': ['currency:read'],
// //       'currency-editor': ['currency:read', 'currency:write'], 
// //       'currency-manager': ['currency:read', 'currency:write', 'currency:delete'],
// //       'User': ['currency:read'],
// //       'admin': ['currency:read', 'currency:write', 'currency:delete']
// //     };
    
// //     // Check if user has permission
// //     const hasAccess = allRoles.some(role => 
// //       permissions[role]?.includes(requiredPermission)
// //     );
    
// //     if (hasAccess) {
// //       next();
// //     } else {
// //       res.status(403).json({ 
// //         error: 'Insufficient permissions',
// //         required: requiredPermission,
// //         userRoles: allRoles 
// //       });
// //     }
// //   };
// // };

// // module.exports = { jwtCheck, hasPermission };






















// // middleware/auth.js - Add debugging
// const { auth } = require('express-oauth2-jwt-bearer');

// const jwtCheck = auth({
//   audience: 'ERP-integerate',
//   issuerBaseURL: 'http://localhost:8080/realms/ERP',
//   tokenSigningAlg: 'RS256'
// });

// // Debug middleware to check incoming tokens
// const debugToken = (req, res, next) => {
//   console.log('🔍 Backend Token Debug:', {
//     url: req.originalUrl,
//     method: req.method,
//     hasAuthHeader: !!req.headers.authorization,
//     authHeaderStart: req.headers.authorization?.substring(0, 50) + '...',
//     timestamp: new Date().toISOString()
//   });
  
//   if (req.headers.authorization) {
//     try {
//       const token = req.headers.authorization.split(' ')[1];
//       const tokenParts = token.split('.');
//       const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
//       const now = Math.floor(Date.now() / 1000);
      
//       console.log('🔍 Token Payload Debug:', {
//         sub: payload.sub,
//         exp: payload.exp,
//         iat: payload.iat,
//         currentTime: now,
//         isExpired: now > payload.exp,
//         timeUntilExp: payload.exp - now
//       });
//     } catch (error) {
//       console.error('❌ Token decode error:', error.message);
//     }
//   }
  
//   next();
// };

// module.exports = { jwtCheck, hasPermission, debugToken };
