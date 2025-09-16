import { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaPhone, FaUser, FaClock } from 'react-icons/fa';

export default function BookingModal({ listing, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    checkInDate: '',
    duration: 1,
    contactNumber: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.checkInDate || !formData.duration || !formData.contactNumber) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate mobile number
    if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    // Validate check-in date
    const checkInDate = new Date(formData.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      setError('Check-in date must be in the future');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing._id,
          ...formData
        })
      });

      const data = await res.json();
      
      if (data.success) {
        onSuccess(data.message);
        onClose();
        // Reset form
        setFormData({
          checkInDate: '',
          duration: 1,
          contactNumber: '',
          message: ''
        });
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const calculateCheckOutDate = () => {
    if (formData.checkInDate && formData.duration) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(checkIn);
      checkOut.setMonth(checkOut.getMonth() + parseInt(formData.duration));
      return checkOut.toLocaleDateString('en-IN');
    }
    return '';
  };

  const calculateTotalAmount = () => {
    const monthlyPrice = listing.offer ? listing.discountPrice : listing.regularPrice;
    return monthlyPrice * parseInt(formData.duration);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Book This PG</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{listing.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Check-in Date */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-600" />
              Check-in Date *
            </label>
            <input
              type="date"
              id="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaClock className="w-4 h-4 mr-2 text-green-600" />
              Duration *
            </label>
            <select
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {[...Array(24)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Month' : 'Months'}
                </option>
              ))}
            </select>
            {formData.checkInDate && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check-out: {calculateCheckOutDate()}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaPhone className="w-4 h-4 mr-2 text-green-600" />
              Your Mobile Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              maxLength="10"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PG owner will contact you on this number
            </p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaUser className="w-4 h-4 mr-2 text-purple-600" />
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any specific requirements or questions..."
              rows="3"
              maxLength="500"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Booking Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Monthly Rent:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  ₹{new Intl.NumberFormat('en-IN').format(listing.offer ? listing.discountPrice : listing.regularPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="text-gray-800 dark:text-gray-200">{formData.duration} months</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-blue-200 dark:border-blue-700 pt-2">
                <span className="text-gray-800 dark:text-gray-200">Total Amount:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ₹{new Intl.NumberFormat('en-IN').format(calculateTotalAmount())}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
            >
              {loading ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
