const express = require('express');
const router = express.Router();
// const authController = require('../Controllers/authcontrollers');
const User = require('../Model/authschema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
// router.put('/update', authController.updateUser);

// Reset Password Route

// Email transporter configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

router.post('/signup', async (req, res) => {
  console.log('Ssdsddds');
  
  try {
    const { email, name, password, confirmpassword, phone, age, address } = req.body;

    // Check if primary email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

// Hash passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(confirmpassword, 10);

    // Create new user
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      confirmpassword: hashedConfirmPassword,
      address,
      phone,
      age
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Request received with email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // // Find user by email
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    // Generate random reset token

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Generated token:', resetToken);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // const mailOptions = {
    //   to: user.email,
    //   from: process.env.EMAIL_USER,
    //   subject: 'Password Reset Request',
    //   html: `
    //     <p>You requested a password reset</p>
    //     <p>Click this link to set a new password:</p>
    //     <a href="${resetUrl}">${resetUrl}</a>
    //     <p>This link will expire in 1 hour.</p>
    //   `
    // };

    // await transporter.sendMail(mailOptions);
    //res.json({ resetToken, message: 'Use this token to reset your password' });
    // Respond with token (since you don't use email)
    console.log('Token saved to user successfully');
    return res.status(200).json({
      message: 'Reset token generated',
      token: resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({ 
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Route
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete User Route
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Users Route
router.get('/user', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
router.post('/logout/:id', async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { $unset: { token: "" } });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
