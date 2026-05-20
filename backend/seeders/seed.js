const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle_bookings';
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    // Clear existing data in the bookings collection
    console.log('Clearing existing bookings from database...');
    await Booking.deleteMany({});
    console.log('Cleared existing bookings.');

    // Read and parse JSON dataset
    const filePath = path.join(__dirname, '../Vehicle_Bookings.json');
    console.log(`Reading dataset from ${filePath}...`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Dataset file not found at ${filePath}`);
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const bookingsData = JSON.parse(rawData);

    console.log(`Found ${bookingsData.length} raw records. Cleaning and transforming data...`);

    const cleanedBookings = [];
    const seenBookingIds = new Set();

    for (const item of bookingsData) {
      // Skip empty or invalid items
      if (!item || !item.Booking_ID || item.Booking_ID === 'null') {
        continue;
      }

      // Check for duplicate Booking_ID to prevent unique constraint validation errors
      if (seenBookingIds.has(item.Booking_ID)) {
        continue;
      }
      seenBookingIds.add(item.Booking_ID);

      // Handle BOM characters in date key
      let rawDate = null;
      for (const key of Object.keys(item)) {
        if (key.includes('Date')) {
          rawDate = item[key];
          break;
        }
      }

      const parseNull = (val) => (val === 'null' || val === '' || val === undefined) ? null : val;
      const parseNum = (val) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
      };

      const dateObj = rawDate ? new Date(rawDate.replace(/-/g, '/')) : null;

      cleanedBookings.push({
        bookingId: item.Booking_ID,
        date: dateObj && !isNaN(dateObj.getTime()) ? dateObj : new Date(),
        time: item.Time || '00:00:00',
        bookingStatus: item.Booking_Status || 'Unknown',
        customerId: item.Customer_ID,
        vehicleType: item.Vehicle_Type || 'Unknown',
        pickupLocation: item.Pickup_Location || 'Unknown',
        dropLocation: item.Drop_Location || 'Unknown',
        vTat: parseNum(item.V_TAT),
        cTat: parseNum(item.C_TAT),
        canceledRidesByCustomer: parseNull(item.Canceled_Rides_by_Customer),
        canceledRidesByDriver: parseNull(item.Canceled_Rides_by_Driver),
        incompleteRides: parseNull(item.Incomplete_Rides),
        incompleteRidesReason: parseNull(item.Incomplete_Rides_Reason),
        bookingValue: parseNum(item.Booking_Value) || 0,
        paymentMethod: parseNull(item.Payment_Method),
        rideDistance: parseNum(item.Ride_Distance) || 0,
        driverRating: parseNum(item.Driver_Ratings),
        customerRating: parseNum(item.Customer_Rating),
        vehicleImage: parseNull(item['Vehicle Images']) === '#NAME?' ? null : parseNull(item['Vehicle Images']),
        isDeleted: false
      });
    }

    console.log(`Processing complete. Cleaned records count: ${cleanedBookings.length}`);
    console.log('Bulk inserting records into MongoDB (this may take a few seconds)...');
    
    // Bulk insert with Mongoose
    const result = await Booking.insertMany(cleanedBookings, { ordered: false });
    console.log(`Successfully seeded ${result.length} bookings into MongoDB.`);

    // Seed default users for testing
    console.log('Seeding default testing users...');
    const User = require('../models/User');
    await User.deleteMany({});
    await User.create([
      {
        name: 'Default Admin',
        email: 'admin@booking.com',
        password: 'admin123',
        role: 'admin',
        customerId: 'CID_ADMIN',
      },
      {
        name: 'Default User',
        email: 'user@booking.com',
        password: 'user123',
        role: 'user',
        customerId: 'CID_USER',
      },
    ]);
    console.log('Seeded admin (admin@booking.com / admin123) and user (user@booking.com / user123) successfully.');

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDB();
