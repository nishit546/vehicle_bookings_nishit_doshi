# 🚗 Vehicle Bookings Backend API Service

A production-ready, MVC-structured Express & MongoDB backend API built to manage, query, and analyze large-scale vehicle booking datasets (18,000+ records). It features robust JWT authentication, role-based access control, advanced querying utilities, soft deletes, and optimized MongoDB aggregation pipelines for business dashboards.

---

## 🛠️ Tech Stack & Key Libraries

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-v5.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-v8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=flat-square&logo=json-web-tokens&logoColor=white)
![BcryptJS](https://img.shields.io/badge/Bcrypt-Secured-blue?style=flat-square)

| Package | Version | Description / Purpose |
| :--- | :--- | :--- |
| **express** | `^5.2.1` | Minimalist web framework for routing and middleware orchestration |
| **mongoose** | `^9.6.2` | Elegant MongoDB object modeling (ODM) for schemas, validations, and aggregation pipelines |
| **bcryptjs** | `^3.0.3` | Secure password hashing algorithms for user records |
| **jsonwebtoken** | `^9.0.3` | Cryptographic JWT token generation and validation for sessions |
| **cors** | `^2.8.6` | Cross-Origin Resource Sharing middleware enabling secure frontend access |
| **dotenv** | `^17.4.2` | Zero-dependency module that loads environment variables from `.env` |
| **nodemon** | `^3.1.14` | Local development utility that auto-restarts Node app on file changes |

---

## 📂 Project Architecture (MVC Flow)

The application follows the standard Model-View-Controller (MVC) architectural pattern:

```
backend/
├── config/              # Database connection bootstrap
│   └── db.js
├── controllers/         # Controller logic handling Express request/response cycles
│   ├── analyticsController.js # Aggregating stats for dashboard widgets
│   ├── authController.js      # User registration, login, and profiles
│   └── bookingController.js   # Booking CRUD operations and pagination
├── middlewares/         # Application level middlewares
│   ├── auth.js          # JWT checking and RBAC (Role-Based Access Control)
│   ├── errorHandler.js  # Centralized global error handling boundary
│   └── logger.js        # Logging incoming API requests (method, route, latency)
├── models/              # Mongoose data schemas and validation rules
│   ├── Booking.js       # Booking structure and indexing
│   └── User.js          # User profile model & password pre-save hash hook
├── routes/              # Express Router endpoints mapping
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   └── healthRoutes.js
├── seeders/             # CLI Data seeding scripts
│   └── seed.js          # Clean, sanitize, and bulk-insert JSON dataset
├── utils/               # Reusable utility scripts (DRY principles)
│   ├── apiResponse.js   # Standardized API response format helpers
│   ├── asyncHandler.js  # Async wrapper removing try/catch boilerplate
│   ├── auth.js          # JWT signing utilities
│   └── paginate.js      # Global dynamic pagination & sorting handler
├── .env                 # Environment config file (git ignored)
├── .env.example         # Environment template file
├── server.js            # Main Express server bootstrap and entry point
├── Vehicle_Bookings.json # Raw JSON dataset
└── vehicle_bookings_postman_collection.json # Exported Postman tests
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory based on the following template:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `5000` | The port Express will listen on |
| `MONGO_URI` | String | `mongodb://localhost:27017/vehicle_bookings` | MongoDB connection URI |
| `JWT_SECRET` | String | `your_jwt_secret_key_here` | Secret key used for signing JWT tokens |
| `JWT_EXPIRE` | String | `24h` | JWT token expiration lifespan |
| `NODE_ENV` | String | `development` | Environment mode (`development`, `production`, `test`) |

---

## 🚀 Getting Started

Follow these steps to run the backend locally:

### 1. Installation
Navigate into the `backend/` folder and install dependencies:
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Ensure you have a local instance of MongoDB running on port `27017`.

### 3. Seed the Database
Run the seeder CLI script. This cleans, validates, and bulk-inserts all 18,289 raw booking records and creates two default test accounts:
```bash
npm run seed
```

**Seeded Credentials for Testing:**
* **Admin User:**
  * **Email:** `admin@booking.com`
  * **Password:** `admin123`
* **Regular User:**
  * **Email:** `user@booking.com`
  * **Password:** `user123`

### 4. Launch Application
Start the development server with live reload enabled via Nodemon:
```bash
npm run dev
```
The server will boot up and be accessible on `http://localhost:5000`.

---

## 📝 API Reference & Documentation

All API responses return a standardized JSON structure:
```json
{
  "success": true, // or false
  "message": "Retrieval description.",
  "data": { ... } // Payload (null on failures)
}
```

### 1. Health Status
* **`GET /api/v1/health`** (Public)
  * Returns server metadata (uptime, environment mode, timestamp).

### 2. User Authentication (`/api/v1/auth`)
* **`POST /register`** (Public)
  * Registers a new user.
  * **Request Body:** `{ "name": "...", "email": "...", "password": "...", "role": "user" }`
* **`POST /login`** (Public)
  * Authenticates credentials and returns a JWT token.
  * **Request Body:** `{ "email": "admin@booking.com", "password": "admin123" }`
* **`GET /profile`** (Private)
  * Retrieves current user profile. Requires token in headers: `Authorization: Bearer <token>`

### 3. Bookings CRUD Operations (`/api/v1/bookings`)
All routes require header verification: `Authorization: Bearer <token>`.

* **`POST /`**
  * Inserts a new booking.
  * **Request Body:** Complete Booking JSON schema.
* **`GET /`**
  * Lists and searches bookings with dynamic paginated filtering.
  * **Query Parameters:**
    * `page` (Number, default: `1`) - Page offset.
    * `limit` (Number, default: `10`) - Page size (max limit: `100`).
    * `sortBy` (String, default: `date:desc`) - Sort target field and order (`field:asc` or `field:desc`).
    * `status` (String) - Filter by exact `bookingStatus` (e.g., `Success`, `Canceled by Customer`).
    * `vehicleType` (String) - Filter by vehicle class (e.g., `Mini`, `Prime Sedan`).
    * `search` (String) - Searches pickup, drop location, or bookingId using case-insensitive regex.
    * `minDistance` / `maxDistance` (Number) - Query ride distance range via `$gte` / `$lte` operators.
    * `minVal` / `maxVal` (Number) - Query booking valuation range via `$gte` / `$lte` operators.
* **`GET /:id`**
  * Fetches booking by database `_id` or unique `bookingId`.
* **`PUT /:id`**
  * Updates booking properties.
* **`DELETE /:id`**
  * Soft-deletes a booking (flips internal `isDeleted` flag to `true`, excluding it from query listings).

### 4. Admin Dashboard Analytics (`/api/v1/analytics`)
Requires authentication token with `admin` role status: `Authorization: Bearer <token>`.

* **`GET /revenue`**
  * Aggregates total booking value, total ride distance, total bookings count, and calculated average revenue per booking grouped by vehicle type.
* **`GET /status-distribution`**
  * Counts total bookings matching each status (e.g. Success, Cancelled, Incomplete).
* **`GET /location-demand`**
  * Groups and lists the Top 10 pickup and drop locations by ride frequencies.
* **`GET /ratings-summary`**
  * Aggregates average driver ratings and customer ratings grouped by vehicle type.

---

## 📈 MongoDB Optimization & Security Specs
* **Indexing:** Custom compound indexes are configured on the `Booking` schema for `{ date: -1, bookingStatus: 1 }` and unique indexes on `{ bookingId: 1 }` to support low-latency querying.
* **Aggregations:** All analytics pipelines optimize matching stages first (filtering out soft deleted records immediately) before starting expensive grouping calculations.
* **Input Cleaning:** The database seeder strips BOM characters, cleans `null` strings, handles numeric type conversions, and safeguards against duplicate constraints.