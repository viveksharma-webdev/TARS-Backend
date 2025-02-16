const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
 },
  email: { 
    type: String,
     required: true,
      unique: true
 },
  password: {
     type: String,
      required: true,
      minlength:6
 },
  notes: [
    { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Note'
     }
 ]  // Array of note ids that this user has created.
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
