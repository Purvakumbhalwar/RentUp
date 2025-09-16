import Wishlist from '../models/wishlist.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Add listing to wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({ userId, listingId });
    if (existingWishlist) {
      return next(errorHandler(400, 'Listing already in wishlist'));
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({ userId, listingId });
    await wishlistItem.save();

    res.status(201).json({
      success: true,
      message: 'Added to wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Remove listing from wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, listingId });
    
    if (!wishlistItem) {
      return next(errorHandler(404, 'Wishlist item not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's wishlist with listing details
export const getUserWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const wishlistItems = await Wishlist.find({ userId })
      .populate({
        path: 'listingId',
        populate: {
          path: 'userRef',
          select: 'username email'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Wishlist.countDocuments({ userId });

    // Filter out items where listing might have been deleted
    const validWishlistItems = wishlistItems.filter(item => item.listingId);

    res.status(200).json({
      success: true,
      data: validWishlistItems,
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

// Check if listing is in user's wishlist
export const checkWishlistStatus = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOne({ userId, listingId });
    
    res.status(200).json({
      success: true,
      isWishlisted: !!wishlistItem
    });
  } catch (error) {
    next(error);
  }
};

// Get wishlist count for a listing (for owners)
export const getListingWishlistCount = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    // Verify the user owns this listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(403, 'You can only view wishlist count for your own listings'));
    }

    const count = await Wishlist.countDocuments({ listingId });
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};

// Get wishlist counts for multiple listings (for owner dashboard)
export const getMultipleListingsWishlistCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all listings owned by this user
    const userListings = await Listing.find({ userRef: userId }, '_id');
    const listingIds = userListings.map(listing => listing._id.toString());

    // Get wishlist counts for all user's listings
    const wishlistCounts = await Wishlist.aggregate([
      { $match: { listingId: { $in: listingIds } } },
      { $group: { _id: '$listingId', count: { $sum: 1 } } }
    ]);

    // Format the response
    const countsMap = {};
    wishlistCounts.forEach(item => {
      countsMap[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: countsMap
    });
  } catch (error) {
    next(error);
  }
};
