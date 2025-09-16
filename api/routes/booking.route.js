import express from 'express';
import { 
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { requireTenant, requireOwner } from '../utils/roleMiddleware.js';

const router = express.Router();

// Create a new booking request (tenants only)
router.post('/create', verifyToken, createBooking);

// Get user's bookings (tenants only)
router.get('/user', verifyToken, getUserBookings);

// Get owner's booking requests (owners only)
router.get('/owner', verifyToken, getOwnerBookings);

// Update booking status (owners only)
router.put('/status/:bookingId', verifyToken, updateBookingStatus);

// Cancel booking (tenants only)
router.put('/cancel/:bookingId', verifyToken, cancelBooking);

// Get booking statistics for owner dashboard (owners only)
router.get('/stats', verifyToken, getBookingStats);

export default router;
