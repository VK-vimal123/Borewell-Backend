const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    serviceRequired: {
      type: String,
      required: [true, 'Required service must be specified'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'In-Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Breakdown'],
      default: 'Normal',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
