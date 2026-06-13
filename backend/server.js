const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/apiResponse');

const healthRoutes     = require('./routes/healthRoutes');
const authRoutes       = require('./routes/authRoutes');
const bookingRoutes    = require('./routes/bookingRoutes');
const analyticsRoutes  = require('./routes/analyticsRoutes');
const paginationRoutes = require('./routes/paginationRoutes');
const searchRoutes     = require('./routes/searchRoutes');
const userRoutes       = require('./routes/userRoutes');
const customerRoutes   = require('./routes/customerRoutes');
const driverRoutes     = require('./routes/driverRoutes');
const paymentRoutes    = require('./routes/paymentRoutes');
const ratingRoutes     = require('./routes/ratingRoutes');
const vehicleRoutes    = require('./routes/vehicleRoutes');
const locationRoutes   = require('./routes/locationRoutes');
const logRoutes        = require('./routes/logRoutes');
const middlewareRoutes  = require('./routes/middlewareRoutes');
const statsRoutes       = require('./routes/statsRoutes');
const jwtRoutes         = require('./routes/jwtRoutes');

connectDB();

const app = express();

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

const advanceController = require('./controllers/advanceController');
const optionsHandler = require('./utils/optionsHandler');

app.options('/health', optionsHandler(['GET', 'HEAD', 'OPTIONS']));
app.options('/api/v1/health', optionsHandler(['GET', 'HEAD', 'OPTIONS']));

app.get('/health', advanceController.getHealth);
app.get('/api/v1/health', advanceController.getHealth);
app.get('/version', advanceController.getVersion);
app.get('/api/v1/version', advanceController.getVersion);
app.get('/compare', require('./middlewares/auth').protect, advanceController.compareBookings);
app.get('/api/v1/compare', require('./middlewares/auth').protect, advanceController.compareBookings);

app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/bookings',  bookingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/search',    searchRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/drivers',   driverRoutes);
app.use('/api/v1/payments',  paymentRoutes);
app.use('/api/v1/ratings',   ratingRoutes);
app.use('/api/v1/vehicles',  vehicleRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/logs',      logRoutes);
app.use('/api/v1/stats',     statsRoutes);
app.use('/api/v1/jwt',       jwtRoutes);
app.use('/api/v1',           middlewareRoutes);
app.use('/api/v1',           paginationRoutes);
app.post('/api/v1/import/json', require('./middlewares/auth').protect, require('./middlewares/rateLimiter').importLimiter, require('./controllers/bookingController').bulkInsertBookings);

// Fallback OPTIONS handler for routes without explicit options definition
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use((req, res, next) => {
  const error = new Error(`Cannot find requested route ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
