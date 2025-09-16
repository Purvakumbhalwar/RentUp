import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    // Validate that user is authenticated
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, 'User not authenticated'));
    }

    // Ensure userRef matches the authenticated user
    const listingData = {
      ...req.body,
      userRef: req.user.id, // Always use the authenticated user's ID
    };

    // Validate required fields
    const requiredFields = ['name', 'description', 'address', 'regularPrice', 'discountPrice', 'bathrooms', 'bedrooms', 'imageUrls'];
    for (const field of requiredFields) {
      if (!listingData[field] && listingData[field] !== 0) {
        return next(errorHandler(400, `${field} is required`));
      }
    }

    // Validate image URLs
    if (!listingData.imageUrls || !Array.isArray(listingData.imageUrls) || listingData.imageUrls.length === 0) {
      return next(errorHandler(400, 'At least one image is required'));
    }

    // Validate price logic
    if (listingData.offer && +listingData.regularPrice <= +listingData.discountPrice) {
      return next(errorHandler(400, 'Discount price must be lower than regular price'));
    }

    const listing = await Listing.create(listingData);
    return res.status(201).json(listing);
  } catch (error) {
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return next(errorHandler(400, `Validation Error: ${message}`));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(errorHandler(400, `${field} already exists`));
    }
    
    next(errorHandler(500, 'Failed to create listing. Please try again.'));
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const location = req.query.location || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    // Build search query for text search
    let searchQuery = {
      offer,
      furnished,
      parking,
      type,
    };

    // Enhanced search functionality
    if (searchTerm || location) {
      const searchConditions = [];
      
      if (searchTerm) {
        searchConditions.push(
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        );
      }
      
      if (location) {
        searchConditions.push(
          { address: { $regex: location, $options: 'i' } },
          // Add support for searching by city, area, or pincode
          { 'address': { $regex: `.*${location}.*`, $options: 'i' } }
        );
      }
      
      // If both searchTerm and location are provided, search in both
      if (searchTerm && location) {
        searchQuery.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { address: { $regex: location, $options: 'i' } }
        ];
      } else if (searchConditions.length > 0) {
        searchQuery.$or = searchConditions;
      }
    }

    const listings = await Listing.find(searchQuery)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};