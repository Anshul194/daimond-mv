import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phoneNo: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String, 
  },
  country: {
    type: String,
  },
  firebaseToken: {
    type: String,
  },
  usedCoupons: {
    type: Array,
    default: [],
  },
}, {
  timestamps: true,
});

const User = models.User || model('User', userSchema);

export default User;
