import Booking from '../models/booking.model.js';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new booking request
export const createBooking = async (req, res, next) => {
  try {
    const { listingId, message, checkInDate, duration, contactNumber } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!listingId || !checkInDate || !duration || !contactNumber) {
      return next(errorHandler(400, 'All required fields must be provided'));
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    // Prevent users from booking their own listings
    if (listing.userRef === userId) {
      return next(errorHandler(400, 'You cannot book your own listing'));
    }

    // Check if user has already made a pending booking for this listing
    const existingBooking = await Booking.findOne({ 
      userId, 
      listingId, 
      status: 'pending' 
    });

    if (existingBooking) {
      return next(errorHandler(400, 'You already have a pending booking for this listing'));
    }

    // Validate check-in date (should be in the future)
    const checkIn = new Date(checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      return next(errorHandler(400, 'Check-in date must be in the future'));
    }

    // Create booking
    const booking = new Booking({
      userId,
      listingId,
      ownerId: listing.userRef,
      message: message || '',
      checkInDate: checkIn,
      duration: parseInt(duration),
      contactNumber,
      status: 'pending'
    });

    await booking.save();

    // Populate the booking with listing and user details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('listingId', 'name address imageUrls')
      .populate('userId', 'username email');

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// Get user's bookings (as a tenant)
export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // Optional filter by status
    const skip = (page - 1) * limit;

    // Build query
    let query = { userId };
    if (status && ['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('listingId', 'name address imageUrls regularPrice discountPrice offer')
      .populate('ownerId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get owner's booking requests (as a PG owner)
export const getOwnerBookings = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // Optional filter by status
    const skip = (page - 1) * limit;

    // Build query
    let query = { ownerId };
    if (status && ['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('listingId', 'name address imageUrls regularPrice discountPrice offer')
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (accept/reject by owner)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status, ownerResponse } = req.body;
    const ownerId = req.user.id;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return next(errorHandler(400, 'Invalid status. Status must be accepted or rejected'));
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(errorHandler(404, 'Booking not found'));
    }

    // Check if user is the owner
    if (booking.ownerId !== ownerId) {
      return next(errorHandler(403, 'You can only update bookings for your own listings'));
    }

    // Check if booking is still pending
    if (booking.status !== 'pending') {
      return next(errorHandler(400, 'This booking has already been processed'));
    }

    // Update booking
    booking.status = status;
    booking.ownerResponse = ownerResponse || '';
    booking.respondedAt = new Date();

    await booking.save();

    // Populate for response
    const updatedBooking = await Booking.findById(bookingId)
      .populate('listingId', 'name address')
      .populate('userId', 'username email');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking (by user)
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(errorHandler(404, 'Booking not found'));
    }

    // Check if user owns this booking
    if (booking.userId !== userId) {
      return next(errorHandler(403, 'You can only cancel your own bookings'));
    }

    // Check if booking can be cancelled (only pending bookings)
    if (booking.status !== 'pending') {
      return next(errorHandler(400, 'Only pending bookings can be cancelled'));
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get booking statistics for owner dashboard
export const getBookingStats = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const stats = await Booking.aggregate([
      { $match: { ownerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      cancelled: 0,
      total: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
};
