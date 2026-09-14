const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET /api/customers - Retrieve all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: error.message,
    });
  }
});

module.exports = router;
