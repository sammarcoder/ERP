// const express = require('express')
// const router = express.Router();
// const {signUp, login , requestPasswordReset, resetPassword ,sendVerificationEmail, verifyEmail} = require('../controllers/user.controller.js')

// router.post('/signup',signUp );
// router.post('/login', login);

// // router.post('/reset',requestPasswordReset)
// router.post('/request-password-reset', requestPasswordReset);
// // Reset password
// router.post('/reset-password', resetPassword);

// // Verification Routes
// router.post('/send-verification-email',sendVerificationEmail)


// router.post('/verify-email', verifyEmail)

// module.exports = router































const express = require('express')
const router = express.Router()
const { signUp, login, requestPasswordReset, resetPassword, sendVerificationEmail, verifyEmail } = require('../controllers/user.controller.js')
console.log({ signUp, login, requestPasswordReset, resetPassword, sendVerificationEmail, verifyEmail }); // Add this line
router.post('/signup', signUp)
router.post('/login', login)

// router.post('/reset', requestPasswordReset)
router.post('/request-password-reset', requestPasswordReset)
router.post('/reset-password', resetPassword)

// Verification Routes
router.post('/send-verification-email', sendVerificationEmail)
router.post('/verify-email', verifyEmail)

module.exports = router