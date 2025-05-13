import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define schema for a saved article
const bookmarkedNewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: { type: String, required: true }, // for uniqueness
  urlToImage: String,
  publishedAt: String,
  source: {
    id: String,
    name: String
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  bookmarks: [bookmarkedNewsSchema] // 👈 New field added here
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
