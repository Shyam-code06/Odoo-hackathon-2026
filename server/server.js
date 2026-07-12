const express = require('express');
const env = require('./src/config/env');
const apiRouter = require('./src/routes/index');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for frontend client
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'TransitOps backend API is running successfully!' });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
