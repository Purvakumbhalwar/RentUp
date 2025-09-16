import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRupeeSign, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [removingId, setRemovingId] = useState(null);
  
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    }
  }, [currentUser, currentPage]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/wishlist/user?page=${currentPage}&limit=12`);
      const data = await res.json();
      
      if (data.success) {
        setWishlistItems(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch wishlist');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const removeFromWishlist = async (listingId) => {
    setRemovingId(listingId);
    try {
      const res = await fetch(`/api/wishlist/remove/${listingId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.listingId._id !== listingId));
      } else {
        alert(data.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
    setRemovingId(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to view your wishlist</p>
          <Link to="/sign-in" className="btn-primary px-6 py-3 rounded-lg">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FaHeart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            PGs you've saved for later viewing
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">Loading your wishlist...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <FaHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring PGs and add your favorites to the wishlist
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse PGs
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && wishlistItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlistItems.map((item) => {
                const listing = item.listingId;
                const finalPrice = listing.offer ? listing.discountPrice : listing.regularPrice;
                
                return (
                  <div 
                    key={item._id} 
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48">
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Offer Badge */}
                      {listing.offer && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Special Offer
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(listing._id)}
                        disabled={removingId === listing._id}
                        className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {removingId === listing._id ? (
                          <FaSpinner className="w-4 h-4 text-red-500 animate-spin" />
                        ) : (
                          <FaTrash className="w-3 h-3 text-red-500" />
                        )}
                      </button>
                      
                      {/* Wishlist Date */}
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        Added {formatDate(item.createdAt)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Title and Location */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {listing.name}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1 text-red-500 flex-shrink-0" />
                          <span className="truncate">{listing.address}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <FaBed className="w-3 h-3 mr-1" />
                          <span>{listing.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <FaBath className="w-3 h-3 mr-1" />
                          <span>{listing.bathrooms} bath</span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaRupeeSign className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                            {formatPrice(finalPrice)}
                          </span>
                          {listing.type === 'rent' && (
                            <span className="text-sm text-gray-500 ml-1">/month</span>
                          )}
                        </div>
                        
                        <Link
                          to={`/listing/${listing._id}`}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <FaEye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </div>

                      {/* Discount Info */}
                      {listing.offer && (
                        <div className="mt-2 text-xs">
                          <span className="text-gray-500 line-through mr-2">
                            ₹{formatPrice(listing.regularPrice)}
                          </span>
                          <span className="text-green-600 font-medium">
                            Save ₹{formatPrice(listing.regularPrice - listing.discountPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
