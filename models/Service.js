const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
      hi: { type: String, required: true },
    },
    shortDescription: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
      hi: { type: String, required: true },
    },
    fullDescription: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
      hi: { type: String, required: true },
    },
    icon: {
      type: String,
      default: 'bi-gear-wide-connected',
    },
    image: {
      type: String,
      default: '',
    },
    features: {
      en: [{ type: String }],
      ta: [{ type: String }],
      hi: [{ type: String }],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
