# Vehicle Bookings Backend API (Full Stack Project – 2026)

A clean, production-ready, MVC-structured Express & MongoDB backend built for managing and analyzing 18,000+ vehicle booking records.

## Features

- **MVC Architecture:** Robust separation of models, views (controllers), and services/routers.
- **JWT Authentication:** Complete user registration, login, and profile protection with JWT expiry checks.
- **Role-Based Access Control (RBAC):** Restrict dashboard and aggregation analytics routes to `admin` role users.
- **Advanced Querying & Search:**
  - Dynamic filters for `status`, `vehicleType`, `customerId`, and `paymentMethod`.
  - Advanced operator conditions for range queries (e.g. `minDistance` / `maxDistance`, `minVal` / `maxVal`).
  - Case-insensitive regex search on `pickupLocation` and `dropLocation`.
  - Reusable pagination utility with customizable page, limit, and sorting (`sortBy=date:desc`).
- **Soft Delete:** Safe deletion using `isDeleted: true` flags instead of physical deletions.
- **MongoDB Aggregation Pipelines:** Rich administrative metrics and aggregation summaries:
  - Total revenue, ride distance, bookings count, and average value grouped by vehicle type.
  - Booking status distribution counts.
  - Top 10 high-demand pickup and drop-off locations.
  - Average customer and driver ratings grouped by vehicle type.
- **Database Seeding Script:** Fast CLI script to clean, validate, sanitize, and bulk insert the raw JSON dataset, plus default testing credentials.
- **Custom Logging & Standardization:**
  - Standardized JSON responses for all success and error states.
  - Request logging middleware outputting request methods, routes, status codes, and execution duration.
  - Centralized async error handler reducing boilerplates and standardizing Mongoose/JWT exceptions.

---

## Tech Stack

- **Core:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** JWT (JSON Web Tokens), BcryptJS
- **Logging & Tools:** Morgan (optional), Custom Logger, Nodemon

---

## Project Structure

```
vehicle_bookings_nishit_doshi/
├── backend/              # Parent folder containing all backend source code & assets
│   ├── config/           # Database connection and environment config
│   │   └── db.js
│   ├── controllers/      # MVC Controllers handling request-response logic
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   └── bookingController.js
│   ├── middlewares/      # Middlewares (Auth, Logger, Error Handler)
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── models/           # Mongoose schemas/models
│   │   ├── Booking.js
│   │   └── User.js
│   ├── routes/           # Express API Routes
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── healthRoutes.js
│   ├── seeders/          # Database seeding scripts
│   │   └── seed.js
│   ├── utils/            # DRY Helpers (ApiResponse, AsyncHandler, Paginate, Auth)
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── auth.js
│   │   └── paginate.js
│   ├── .env              # Local environment configuration file (ignored in Git)
│   ├── .env.example      # Environment template file
│   ├── package.json      # Node.js project manifest
│   ├── server.js         # Entry point for bootstrapping the application
│   ├── Vehicle_Bookings.json # Raw JSON dataset
│   └── vehicle_bookings_postman_collection.json # Exported Postman collection
└── .gitignore            # Root-level Git ignore configuration
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** running locally on default port `27017`

### 2. Installation
Install the project dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle_bookings
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
NODE_ENV=development
```

### 4. Seed the Database
Seed the booking records and default testing users using the seeding script:
```bash
npm run seed
```

Default credentials generated for testing:
- **Admin User:**
  - Email: `admin@booking.com`
  - Password: `admin123`
- **Regular User:**
  - Email: `user@booking.com`
  - Password: `user123`

### 5. Running the Application
Start the development server with live reload:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

---

## API Documentation

### 1. Health Endpoint
- `GET /api/v1/health` - Check API server connection status.

### 2. Authentication Endpoint (`/api/v1/auth`)
- `POST /register` - Register a new user account.
- `POST /login` - Login to receive a JWT access token.
- `GET /profile` - Retrieve the current logged-in user profile (Requires `Authorization: Bearer <token>` header).

### 3. Bookings Endpoints (`/api/v1/bookings`)
All routes require a valid JWT header: `Authorization: Bearer <token>`.
- `POST /` - Create a new booking entry.
- `GET /` - List all bookings.
  - **Query Params:**
    - `page` (default `1`) & `limit` (default `10`)
    - `sortBy` (e.g. `sortBy=date:desc` or `sortBy=bookingValue:asc`)
    - `status` (e.g. `status=Success` or `status=Canceled by Driver`)
    - `vehicleType` (e.g. `vehicleType=Prime SUV` or `vehicleType=Bike`)
    - `search` (Search by bookingId, pickupLocation, or dropLocation)
    - `minDistance` / `maxDistance` (Filter range for ride distance)
    - `minVal` / `maxVal` (Filter range for booking value)
- `GET /:id` - Get a booking by its unique `bookingId` or database `_id`.
- `PUT /:id` - Update an existing booking.
- `DELETE /:id` - Soft delete a booking (sets `isDeleted = true`).

### 4. Admin Analytics Endpoints (`/api/v1/analytics`)
Requires JWT authorization header with `admin` role status.
- `GET /revenue` - Revenue and ride distances by vehicle type.
- `GET /status-distribution` - Count distribution of bookings.
- `GET /location-demand` - Top 10 high-traffic pickup and drop locations.
- `GET /ratings-summary` - Customer vs driver ratings average scores by vehicle.