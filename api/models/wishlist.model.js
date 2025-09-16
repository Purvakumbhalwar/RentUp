import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate wishlist entries
wishlistSchema.index({ userId: 1, listingId: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
