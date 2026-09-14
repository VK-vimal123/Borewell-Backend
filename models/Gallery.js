const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
      hi: { type: String, required: true },
    },
    category: {
      type: String,
      required: true,
      enum: ['workshop', 'welding', 'rig', 'drilling_rods', 'compressor'],
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      en: { type: String, default: '' },
      ta: { type: String, default: '' },
      hi: { type: String, default: '' },
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

module.exports = mongoose.model('Gallery', gallerySchema);
