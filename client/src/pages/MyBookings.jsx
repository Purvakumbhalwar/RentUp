import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRupeeSign, 
  FaEye, 
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaPhone,
  FaUser
} from 'react-icons/fa';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser, currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = `/api/booking/user?page=${currentPage}&limit=10`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const cancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/booking/cancel/${bookingId}`, {
        method: 'PUT',
      });
      
      const data = await res.json();
      if (data.success) {
        fetchBookings(); // Refresh the list
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
    setCancellingId(null);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <FaBan className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaCalendarAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to view your bookings</p>
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
          <div className="flex items-center space-x-3 mb-4">
            <FaCalendarAlt className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              My Bookings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Track your PG booking requests and their status
          </p>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'accepted' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">Loading your bookings...</span>
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
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {statusFilter ? `No ${statusFilter} bookings found` : 'You haven\'t made any booking requests yet'}
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse PGs
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <>
            <div className="space-y-6 mb-8">
              {bookings.map((booking) => {
                const listing = booking.listingId;
                const finalPrice = listing.offer ? listing.discountPrice : listing.regularPrice;
                const totalAmount = finalPrice * booking.duration;
                
                return (
                  <div 
                    key={booking._id} 
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="md:flex">
                      {/* Image */}
                      <div className="md:w-1/3">
                        <img
                          src={listing.imageUrls[0]}
                          alt={listing.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          {/* Status Badge */}
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-2 capitalize">{booking.status}</span>
                          </div>
                          
                          {/* Booking Date */}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Requested on {formatDate(booking.createdAt)}
                          </span>
                        </div>

                        {/* PG Details */}
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {listing.name}
                          </h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <FaMapMarkerAlt className="w-3 h-3 mr-1 text-red-500" />
                            <span>{listing.address}</span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <FaBed className="w-4 h-4 mr-1" />
                              <span>{listing.bedrooms} bed</span>
                            </div>
                            <div className="flex items-center">
                              <FaBath className="w-4 h-4 mr-1" />
                              <span>{listing.bathrooms} bath</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Check-in Date</label>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {formatDate(booking.checkInDate)}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Duration</label>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {booking.duration} months
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Monthly Rent</label>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              ₹{formatPrice(finalPrice)}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Total Amount</label>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              ₹{formatPrice(totalAmount)}
                            </p>
                          </div>
                        </div>

                        {/* Contact Number */}
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center text-sm">
                            <FaPhone className="w-3 h-3 mr-2 text-blue-600" />
                            <span className="text-gray-600 dark:text-gray-400 mr-2">Your contact:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{booking.contactNumber}</span>
                          </div>
                        </div>

                        {/* Message */}
                        {booking.message && (
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Your Message:</label>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{booking.message}</p>
                          </div>
                        )}

                        {/* Owner Response */}
                        {booking.ownerResponse && (
                          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <label className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Owner Response:</label>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{booking.ownerResponse}</p>
                            {booking.respondedAt && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Responded on {formatDate(booking.respondedAt)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/listing/${listing._id}`}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <FaEye className="w-3 h-3 mr-2" />
                              View PG
                            </Link>
                            
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => cancelBooking(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                {cancellingId === booking._id ? (
                                  <FaSpinner className="w-3 h-3 mr-2 animate-spin" />
                                ) : (
                                  <FaBan className="w-3 h-3 mr-2" />
                                )}
                                Cancel Request
                              </button>
                            )}
                          </div>
                          
                          {/* Owner Contact Info */}
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <FaUser className="w-3 h-3 mr-1" />
                              <span>Owner: {booking.ownerId.username}</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
