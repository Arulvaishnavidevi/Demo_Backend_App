// const User = require('../Model/authschema');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // JWT secret
// const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// const createToken = (user) => {
//   return jwt.sign({ id: user._id }, JWT_SECRET, {
//     expiresIn: '1h'
//   });
// };


// const signup = async (req, res) => {

//     try {
//         const { email, name, confirmpassword, password } = req.body;

//         if (password !== confirmpassword) {
//       return res.status(400).json({ error: 'Passwords do not match' });
//     }

//    // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }


//         const hashedPassword = await bcrypt.hash(password, 10);
//         const hashedConfirmPassword = await bcrypt.hash(confirmpassword, 10)

//         const user = await User.create({ name, email, password: hashedPassword, confirmpassword : hashedConfirmPassword });
//         const token =createToken(user._id); 
//         user.token = token;
//         await user.save();

//         // Create token
//     // jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ message: 'User created successfully!', token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error during signup' });
//   }
// };

// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Find user by email
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         //const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
//         // Login success
//             const token = createToken(user._id);

    
//         res.status(200).json({ message: 'Login successful', token ,user:{ id:user._id,email:user.email}});
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };


// const updateUser = async (req, res) => {
//   // const { email,name, password } = req.body;
//   const {userId}=req.params

//   try {
//     // Find user by ID
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Update email if provided
//       // const existing = await User.findOne({ email: email });
//       // if (existing) {
//       //   return res.status(400).json({ message: 'Email already in use' });
//       // }

//    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
//         if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json({ message: 'User updated successfully' });

//   } catch (err) {
//     console.error('Update error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


