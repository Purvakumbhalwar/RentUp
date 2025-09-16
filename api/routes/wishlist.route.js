import express from 'express';
import { 
  addToWishlist, 
  removeFromWishlist, 
  getUserWishlist, 
  checkWishlistStatus,
  getListingWishlistCount,
  getMultipleListingsWishlistCount
} from '../controllers/wishlist.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { requireTenant, requireOwner } from '../utils/roleMiddleware.js';

const router = express.Router();

// Add to wishlist (tenants only)
router.post('/add', verifyToken, addToWishlist);

// Remove from wishlist (tenants only)
router.delete('/remove/:listingId', verifyToken, removeFromWishlist);

// Get user's wishlist (tenants only)
router.get('/user', verifyToken, getUserWishlist);

// Check if listing is in user's wishlist (tenants only)
router.get('/check/:listingId', verifyToken, checkWishlistStatus);

// Get wishlist count for a specific listing (owners only)
router.get('/count/:listingId', verifyToken, getListingWishlistCount);

// Get wishlist counts for all user's listings (owners only)
router.get('/counts/all', verifyToken, getMultipleListingsWishlistCount);

export default router;
