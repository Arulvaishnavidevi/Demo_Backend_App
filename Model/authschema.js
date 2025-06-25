const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    confirmpassword:{type:String, required:true},
    age: {type:Number},
    address: {type:String},
    phone: {type:String},
    token:{type:String},
     // ... your existing fields ...
  resetPasswordToken: {type: String},
  resetPasswordExpires:{ type:Date},
  // ... your other fields ...
  
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // this.password = await bcrypt.hash(this.password, 10);
  next();
});
module.exports = mongoose.model('User', userSchema);
