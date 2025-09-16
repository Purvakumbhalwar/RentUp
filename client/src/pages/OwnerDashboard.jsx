import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRupeeSign, 
  FaEye, 
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaUser,
  FaCheck,
  FaTimes,
  FaChartBar,
  FaHeart
} from 'react-icons/fa';

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [responseModal, setResponseModal] = useState({ show: false, booking: null, action: '' });
  const [responseText, setResponseText] = useState('');
  
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
      fetchStats();
    }
  }, [currentUser, currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = `/api/booking/owner?page=${currentPage}&limit=10`;
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

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/booking/stats');
      const data = await res.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status, ownerResponse = '') => {
    setProcessingId(bookingId);
    try {
      const res = await fetch(`/api/booking/status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, ownerResponse })
      });
      
      const data = await res.json();
      if (data.success) {
        fetchBookings(); // Refresh the list
        fetchStats(); // Refresh stats
        setResponseModal({ show: false, booking: null, action: '' });
        setResponseText('');
      } else {
        alert(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
    setProcessingId(null);
  };

  const handleQuickAction = (booking, action) => {
    if (action === 'accept') {
      updateBookingStatus(booking._id, 'accepted');
    } else {
      setResponseModal({ show: true, booking, action });
    }
  };

  const handleResponseSubmit = () => {
    if (responseModal.booking) {
      updateBookingStatus(
        responseModal.booking._id, 
        responseModal.action === 'accept' ? 'accepted' : 'rejected', 
        responseText
      );
    }
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
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaHome className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to access the owner dashboard</p>
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
            <FaHome className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Owner Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Manage your PG booking requests and track your properties
          </p>
          
          {/* Stats Cards */}
          {Object.keys(stats).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <FaClock className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.pending || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <FaCheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.accepted || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <FaTimesCircle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.rejected || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <FaChartBar className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.total || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
              All Requests
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Pending ({stats.pending || 0})
            </button>
            <button
              onClick={() => setStatusFilter('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'accepted' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Accepted ({stats.accepted || 0})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Rejected ({stats.rejected || 0})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">Loading booking requests...</span>
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
            <FaHome className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No booking requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {statusFilter ? `No ${statusFilter} requests found` : 'You haven\'t received any booking requests yet'}
            </p>
            <Link 
              to="/profile" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Manage Listings
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
                          
                          {/* Request Date */}
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

                        {/* Tenant Info */}
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tenant Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center">
                              <FaUser className="w-3 h-3 mr-2 text-blue-600" />
                              <span className="text-gray-600 dark:text-gray-400 mr-2">Name:</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">{booking.userId.username}</span>
                            </div>
                            <div className="flex items-center">
                              <FaPhone className="w-3 h-3 mr-2 text-green-600" />
                              <span className="text-gray-600 dark:text-gray-400 mr-2">Contact:</span>
                              <a 
                                href={`tel:${booking.contactNumber}`}
                                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {booking.contactNumber}
                              </a>
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

                        {/* Tenant Message */}
                        {booking.message && (
                          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <label className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Tenant Message:</label>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{booking.message}</p>
                          </div>
                        )}

                        {/* Your Response */}
                        {booking.ownerResponse && (
                          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <label className="text-xs text-green-600 dark:text-green-400 font-medium">Your Response:</label>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{booking.ownerResponse}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Responded on {formatDate(booking.respondedAt)}
                            </p>
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
                              <>
                                <button
                                  onClick={() => handleQuickAction(booking, 'accept')}
                                  disabled={processingId === booking._id}
                                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  {processingId === booking._id ? (
                                    <FaSpinner className="w-3 h-3 mr-2 animate-spin" />
                                  ) : (
                                    <FaCheck className="w-3 h-3 mr-2" />
                                  )}
                                  Accept
                                </button>
                                
                                <button
                                  onClick={() => handleQuickAction(booking, 'reject')}
                                  disabled={processingId === booking._id}
                                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  <FaTimes className="w-3 h-3 mr-2" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                          
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Email: {booking.userId.email}
                          </span>
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

        {/* Response Modal */}
        {responseModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  {responseModal.action === 'accept' ? 'Accept' : 'Reject'} Booking Request
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Response Message (Optional)
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={`Add a ${responseModal.action === 'accept' ? 'welcome' : 'explanation'} message...`}
                    rows="3"
                    maxLength="500"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {responseText.length}/500 characters
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setResponseModal({ show: false, booking: null, action: '' });
                      setResponseText('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResponseSubmit}
                    className={`flex-1 px-4 py-2 text-white rounded-lg ${
                      responseModal.action === 'accept' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {responseModal.action === 'accept' ? 'Accept' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
