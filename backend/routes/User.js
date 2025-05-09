const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

// Use mongoose.models to avoid redefining the model if it's already declared.
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
