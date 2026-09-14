const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\s\-()]{7,20}$/, 'Please enter a valid phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Customer', customerSchema);
