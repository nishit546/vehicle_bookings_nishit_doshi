const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/apiResponse');

// Import routes
const healthRoutes     = require('./routes/healthRoutes');
const authRoutes       = require('./routes/authRoutes');
const bookingRoutes    = require('./routes/bookingRoutes');
const analyticsRoutes  = require('./routes/analyticsRoutes');
const paginationRoutes = require('./routes/paginationRoutes');

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// 1. CORS Configuration
const corsOptions = {
  origin: '*', // Allows all origins in development; can specify frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// 2. Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Custom Request Logger
app.use(requestLogger);

// 4. Mount API Routes
app.use('/api/v1/health',    healthRoutes);
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/bookings',  bookingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1',           paginationRoutes);

// 5. Fallback 404 Route handler
app.use((req, res, next) => {
  const error = new Error(`Cannot find requested route ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 6. Global Error Handler Middleware
app.use(errorHandler);

// Define PORT and start listening
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
