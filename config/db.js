const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sri_vellingiri_db';
  console.log(`Attempting MongoDB connection at: ${connUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection note: ${error.message}`);
    console.warn(`ℹ️ The workshop server is operating with built-in data cache and will automatically reconnect when MongoDB is started.`);
    return null;
  }
};

const getStatus = () => {
  const state = mongoose.connection.readyState;
  const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    isConnected: state === 1,
    state: stateNames[state] || 'disconnected',
    host: mongoose.connection.host || 'localhost',
    name: mongoose.connection.name || 'sri_vellingiri_db'
  };
};

module.exports = { connectDB, getStatus };
