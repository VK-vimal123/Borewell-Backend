const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const { servicesData } = require('../seeds/seedData');

// GET /api/services - Retrieve active services
router.get('/', async (req, res) => {
  try {
    let list = servicesData;
    if (mongoose.connection.readyState === 1) {
      const services = await Service.find({ isActive: true }).sort({ displayOrder: 1 });
      if (services && services.length > 0) {
        list = services;
      }
    }
    const filtered = list.filter(
      (s) => s.slug !== 'compressor-works' && s.slug !== 'rig-repair-maintenance'
    );
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error in services route, using fallback:', error.message);
    const filtered = servicesData.filter(
      (s) => s.slug !== 'compressor-works' && s.slug !== 'rig-repair-maintenance'
    );
    return res.json({ success: true, count: filtered.length, data: filtered });
  }
});

// GET /api/services/:slug - Retrieve single service
router.get('/:slug', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const service = await Service.findOne({ slug: req.params.slug, isActive: true });
      if (service) return res.json({ success: true, data: service });
    }
    const match = servicesData.find(s => s.slug === req.params.slug);
    if (!match) return res.status(404).json({ success: false, message: 'Service not found' });
    return res.json({ success: true, data: match });
  } catch (error) {
    const match = servicesData.find(s => s.slug === req.params.slug);
    if (!match) return res.status(404).json({ success: false, message: 'Service not found' });
    return res.json({ success: true, data: match });
  }
});

module.exports = router;
