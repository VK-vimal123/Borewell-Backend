const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { connectDB, getStatus } = require('./config/db');
const serviceRoutes = require('./routes/services');
const galleryRoutes = require('./routes/gallery');
const serviceRequestRoutes = require('./routes/serviceRequests');
const customerRoutes = require('./routes/customers');

const Service = require('./models/Service');
const Gallery = require('./models/Gallery');
const { servicesData, galleryData } = require('./seeds/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Auto-connect DB middleware for serverless & regular runs
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Non-fatal, routes handle fallback
  }
  next();
});

// Serve Frontend Static Assets if local directory exists
const frontendPath = path.join(__dirname, '../frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getStatus();
  res.json({
    status: 'online',
    workshop: 'Sri Vellingiri Engineering Works API',
    timestamp: new Date(),
    database: dbStatus,
  });
});

// Root / Welcome Endpoint
app.get('/', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'online',
    service: 'Sri Vellingiri Engineering Works Backend API',
    database: getStatus(),
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      gallery: '/api/gallery',
      serviceRequests: '/api/service-requests',
      customers: '/api/customers'
    }
  });
});

// Register API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/customers', customerRoutes);

// Fallback Route
app.use('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Auto-seed database helper if connected and empty
async function autoSeedIfEmpty() {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('🌱 Services collection is empty. Auto-seeding initial service records...');
      await Service.insertMany(servicesData);
      console.log('✅ Services auto-seeded successfully.');
    }

    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      console.log('🌱 Gallery collection is empty. Auto-seeding initial gallery records...');
      await Gallery.insertMany(galleryData);
      console.log('✅ Gallery auto-seeded successfully.');
    }
  } catch (err) {
    // Non-fatal warning
  }
}

// Only listen locally (not during Vercel serverless executions)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Sri Vellingiri Engineering Works Server is live!`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);

    connectDB().then((conn) => {
      if (conn) {
        autoSeedIfEmpty();
      }
    }).catch((err) => {
      console.warn('DB Connection background note:', err.message);
    });
  });
}

module.exports = app;
