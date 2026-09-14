const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  // If already connected, reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, wait for it
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return cachedPromise;
  }

  const connUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sri_vellingiri_db';
  const maskedUri = connUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`Connecting to MongoDB: ${maskedUri}`);

  try {
    cachedPromise = mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });

    const conn = await cachedPromise;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    return null;
  }
};

const getStatus = () => {
  const state = mongoose.connection.readyState;
  const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    isConnected: state === 1,
    state: stateNames[state] || 'disconnected',
    host: mongoose.connection.host || 'unknown',
    name: mongoose.connection.name || 'sri_vellingiri_db'
  };
};

module.exports = { connectDB, getStatus };
