const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ServiceRequest = require('../models/ServiceRequest');
const Customer = require('../models/Customer');

// In-memory fallback array for service requests & customers
const fallbackRequests = [];
const fallbackCustomers = [];

// POST /api/service-requests - Create a new service request and save customer
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, serviceRequired, message, urgency, preferredDate } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    if (!serviceRequired || !serviceRequired.trim()) {
      return res.status(400).json({ success: false, message: 'Service required must be selected' });
    }

    const cleanPhone = phone.trim();
    const cleanName = customerName.trim();

    if (mongoose.connection.readyState === 1) {
      // Check if customer already exists or create new customer
      let customer = await Customer.findOne({ phone: cleanPhone });
      if (!customer) {
        customer = await Customer.create({
          name: cleanName,
          phone: cleanPhone,
          notes: `First inquiry for ${serviceRequired}`,
        });
      } else {
        if (cleanName && customer.name !== cleanName) {
          customer.name = cleanName;
          await customer.save();
        }
      }

      // Create Service Request
      const newRequest = await ServiceRequest.create({
        customerName: cleanName,
        phone: cleanPhone,
        serviceRequired: serviceRequired.trim(),
        message: message ? message.trim() : '',
        customerId: customer._id,
        urgency: urgency || 'Normal',
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        status: 'Pending',
      });

      return res.status(201).json({
        success: true,
        message: 'Service request submitted successfully! Our workshop team will contact you shortly.',
        data: {
          requestId: newRequest._id,
          customerName: newRequest.customerName,
          phone: newRequest.phone,
          serviceRequired: newRequest.serviceRequired,
          status: newRequest.status,
          createdAt: newRequest.createdAt,
        },
      });
    }

    // In-memory fallback
    const fakeId = 'REQ-' + Date.now();
    const fallbackItem = {
      _id: fakeId,
      customerName: cleanName,
      phone: cleanPhone,
      serviceRequired: serviceRequired.trim(),
      message: message ? message.trim() : '',
      urgency: urgency || 'Normal',
      status: 'Pending',
      createdAt: new Date(),
    };
    fallbackRequests.unshift(fallbackItem);

    return res.status(201).json({
      success: true,
      message: 'Service request submitted successfully! Our workshop team will contact you shortly.',
      data: fallbackItem,
    });
  } catch (error) {
    console.error('Error submitting service request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit service request. Please call our workshop directly.',
      error: error.message,
    });
  }
});

// GET /api/service-requests - List service requests
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status) filter.status = status;
      const requests = await ServiceRequest.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10))
        .populate('customerId', 'name phone email location');

      return res.json({ success: true, count: requests.length, data: requests });
    }

    let results = fallbackRequests;
    if (status) results = results.filter(r => r.status === status);
    return res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return res.json({ success: true, count: fallbackRequests.length, data: fallbackRequests });
  }
});

// PATCH /api/service-requests/:id/status - Update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In-Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await ServiceRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (updated) return res.json({ success: true, message: `Status updated to ${status}`, data: updated });
    }

    const match = fallbackRequests.find(r => r._id === req.params.id);
    if (match) {
      match.status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, data: match });
    }

    return res.status(404).json({ success: false, message: 'Service request not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update request status', error: error.message });
  }
});

module.exports = router;
