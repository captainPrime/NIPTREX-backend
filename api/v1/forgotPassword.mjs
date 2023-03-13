const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

// Forgot password
router.post('/forgotpassword', [
  body('email', 'Please enter a valid email').isEmail()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate password reset token and expiration time
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresIn = Date.now() + 3600000;

    // Update user's reset token and expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiresIn;
    await user.save();

    // Create transport for sending email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Create email message
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset',
      html: `
        <p>You are receiving this email because you have requested a password reset.</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${process.env.FRONTEND_URL}/resetpassword/${resetToken}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Reset password
router.post('/resetpassword/:token', [
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user by reset token and check expiration time
let user = await User.findOne({
resetPasswordToken: token,
resetPasswordExpires: { $gt: Date.now() }
});

if (!user) {
  return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
}

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Update user's password and reset token
user.password = hashedPassword;
user.resetPasswordToken = null;
user.resetPasswordExpires = null;
await user.save();

// Create JWT for authentication
const payload = {
  user: {
    id: user.id
  }
};
jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
  if (err) throw err;
  res.status(200).json({ token });
});
} catch (err) {
console.error(err.message);
res.status(500).send('Server Error');
}
});

module.exports = router;