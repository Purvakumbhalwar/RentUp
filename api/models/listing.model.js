import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return !v || /^[6-9]\d{9}$/.test(v); // Indian mobile number validation
        },
        message: 'Please enter a valid Indian mobile number'
      }
    },
    location: {
      latitude: {
        type: Number,
        required: false,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: false,
        min: -180,
        max: 180
      }
    }
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
