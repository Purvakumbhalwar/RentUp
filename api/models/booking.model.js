import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    listingId: {
      type: String,
      required: true,
      ref: 'Listing'
    },
    ownerId: {
      type: String,
      required: true,
      ref: 'User'
    },
    message: {
      type: String,
      required: false,
      maxLength: 500
    },
    checkInDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // Duration in months
      required: true,
      min: 1,
      max: 24
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    },
    contactNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[6-9]\d{9}$/.test(v); // Indian mobile number validation
        },
        message: 'Please enter a valid Indian mobile number'
      }
    },
    ownerResponse: {
      type: String,
      required: false,
      maxLength: 500
    },
    respondedAt: {
      type: Date,
      required: false
    }
  },
  { timestamps: true }
);

// Index for efficient queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ ownerId: 1, status: 1 });
bookingSchema.index({ listingId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
