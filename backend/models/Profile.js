const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 👈 Referencing User
  },
  name: String,
  email: String,
  contact: String,
  skill: String,
  experience: String,
  category: String,
  photo: String,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
