require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("Testing with:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  to: process.env.EMAIL_USER,
  subject: 'Test',
  text: 'Test email',
}, (err, info) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});