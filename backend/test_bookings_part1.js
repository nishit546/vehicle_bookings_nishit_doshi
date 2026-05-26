const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { getBookings } = require('./controllers/bookingController');

const runHandler = (handler, req) => {
  return new Promise((resolve, reject) => {
    const res = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.body = data;
      resolve(res);
      return res;
    };
    const next = (err) => {
      if (err) reject(err);
      else resolve(res);
    };
    handler(req, res, next);
  });
};

async function runTests() {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.');

  // Query 1: GET /bookings?status=Success&page=1&limit=10&sort=-Booking_Value
  console.log('\n--- Query 1: status=Success&page=1&limit=10&sort=-Booking_Value ---');
  const res1 = await runHandler(getBookings, {
    query: { status: 'Success', page: '1', limit: '10', sort: '-Booking_Value' }
  });
  console.log('Status Code:', res1.statusCode);
  console.log('Results count:', res1.body.data ? res1.body.data.results.length : 0);
  if (res1.body.data && res1.body.data.results.length > 0) {
    console.log('First booking status:', res1.body.data.results[0].bookingStatus);
    console.log('First booking value:', res1.body.data.results[0].bookingValue);
    if (res1.body.data.results.length > 1) {
      console.log('Second booking value:', res1.body.data.results[1].bookingValue);
      console.log('Correctly sorted descending:', res1.body.data.results[0].bookingValue >= res1.body.data.results[1].bookingValue);
    }
  }

  // Query 2: GET /bookings?vehicle=Bike&page=2&limit=5
  console.log('\n--- Query 2: vehicle=Bike&page=2&limit=5 ---');
  const res2 = await runHandler(getBookings, {
    query: { vehicle: 'Bike', page: '2', limit: '5' }
  });
  console.log('Status Code:', res2.statusCode);
  console.log('Results count:', res2.body.data ? res2.body.data.results.length : 0);
  if (res2.body.data && res2.body.data.results.length > 0) {
    console.log('First booking vehicleType:', res2.body.data.results[0].vehicleType);
  }

  // Query 3: GET /bookings?payment=UPI&sort=-Ride_Distance
  console.log('\n--- Query 3: payment=UPI&sort=-Ride_Distance ---');
  const res3 = await runHandler(getBookings, {
    query: { payment: 'UPI', sort: '-Ride_Distance', limit: '5' }
  });
  console.log('Status Code:', res3.statusCode);
  console.log('Results count:', res3.body.data ? res3.body.data.results.length : 0);
  if (res3.body.data && res3.body.data.results.length > 0) {
    console.log('First booking paymentMethod:', res3.body.data.results[0].paymentMethod);
    console.log('First booking rideDistance:', res3.body.data.results[0].rideDistance);
    if (res3.body.data.results.length > 1) {
      console.log('Second booking rideDistance:', res3.body.data.results[1].rideDistance);
    }
  }

  // Query 4: GET /bookings?pickup=Indiranagar&page=1&limit=20
  console.log('\n--- Query 4: pickup=Indiranagar&page=1&limit=20 ---');
  const res4 = await runHandler(getBookings, {
    query: { pickup: 'Indiranagar', page: '1', limit: '20' }
  });
  console.log('Status Code:', res4.statusCode);
  console.log('Results count:', res4.body.data ? res4.body.data.results.length : 0);
  if (res4.body.data && res4.body.data.results.length > 0) {
    console.log('First booking pickupLocation:', res4.body.data.results[0].pickupLocation);
  }

  // Query 5: GET /bookings?drop=Jayanagar&sort=Customer_Rating
  console.log('\n--- Query 5: drop=Jayanagar&sort=Customer_Rating ---');
  const res5 = await runHandler(getBookings, {
    query: { drop: 'Jayanagar', sort: 'Customer_Rating', limit: '5' }
  });
  console.log('Status Code:', res5.statusCode);
  console.log('Results count:', res5.body.data ? res5.body.data.results.length : 0);
  if (res5.body.data && res5.body.data.results.length > 0) {
    console.log('First booking dropLocation:', res5.body.data.results[0].dropLocation);
    console.log('First booking customerRating:', res5.body.data.results[0].customerRating);
    if (res5.body.data.results.length > 1) {
      console.log('Second booking customerRating:', res5.body.data.results[1].customerRating);
    }
  }

  await mongoose.connection.close();
  console.log('\nDatabase connection closed. Part 1 tests complete.');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  mongoose.connection.close();
});
