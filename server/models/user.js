const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  authToken: { type: String, default: null },
});

module.exports = mongoose.model('User', UserSchema);
