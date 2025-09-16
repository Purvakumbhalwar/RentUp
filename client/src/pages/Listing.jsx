import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaPhone,
  FaWhatsapp,
  FaHeart,
  FaWifi,
  FaCar,
  FaUtensils,
  FaShieldAlt,
  FaRupeeSign,
  FaCalendarAlt
} from 'react-icons/fa';
import Contact from '../components/Contact';
import BookingModal from '../components/BookingModal';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // Check wishlist status when user is logged in and listing is loaded (tenants only)
  useEffect(() => {
    if (currentUser && currentUser.role === 'tenant' && listing && listing._id) {
      checkWishlistStatus();
    }
  }, [currentUser, listing]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch(`/api/wishlist/check/${listing._id}`);
      const data = await res.json();
      if (data.success) {
        setIsWishlisted(data.isWishlisted);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!currentUser) {
      alert('Please login to add to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      const url = isWishlisted 
        ? `/api/wishlist/remove/${listing._id}` 
        : '/api/wishlist/add';
      
      const method = isWishlisted ? 'DELETE' : 'POST';
      const body = isWishlisted ? undefined : JSON.stringify({ listingId: listing._id });

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await res.json();
      if (data.success) {
        setIsWishlisted(!isWishlisted);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      alert('Error updating wishlist');
    }
    setWishlistLoading(false);
  };

  const handleBookingSuccess = (message) => {
    setBookingSuccess(message);
    setTimeout(() => setBookingSuccess(''), 5000);
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {loading && (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='flex items-center space-x-3'>
            <div className='animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full'></div>
            <span className='text-gray-600 dark:text-gray-400 text-lg'>Loading PG details...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <div className='text-6xl mb-4'>😞</div>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>Oops! Something went wrong</h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>Unable to load PG details. Please try again later.</p>
            <button onClick={() => window.history.back()} className='btn-primary px-6 py-3 rounded-lg'>
              Go Back
            </button>
          </div>
        </div>
      )}
      
      {listing && !loading && !error && (
        <div className='animate-fadeIn'>
          {/* Image Gallery */}
          <div className='relative'>
            <Swiper navigation className='h-[400px] md:h-[500px] lg:h-[600px]'>
              {listing.imageUrls.map((url, index) => (
                <SwiperSlide key={url}>
                  <div className='relative h-full'>
                    <img
                      src={url}
                      alt={`${listing.name} - Image ${index + 1}`}
                      className='w-full h-full object-cover'
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding='async'
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-20'></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Floating Action Buttons */}
            <div className='absolute top-4 right-4 z-10 flex flex-col space-y-3'>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className='w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
              >
                <FaShare className='text-gray-600 dark:text-gray-400 w-4 h-4' />
              </button>
              {currentUser && currentUser.role === 'tenant' && listing.userRef !== currentUser._id && (
                <button 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isWishlisted ? 'ring-2 ring-red-500' : ''
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FaHeart className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
              )}
            </div>
            
            {/* Share Success Message */}
            {copied && (
              <div className='fixed top-20 right-4 z-20 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slideIn'>
                Link copied to clipboard!
              </div>
            )}
            
            {/* Booking Success Message */}
            {bookingSuccess && (
              <div className='fixed top-20 left-1/2 transform -translate-x-1/2 z-20 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn max-w-md text-center'>
                {bookingSuccess}
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - Main Details */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Title and Price */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                  <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                        {listing.name}
                      </h1>
                      <div className='flex items-center text-gray-600 dark:text-gray-400 mb-4'>
                        <FaMapMarkerAlt className='w-4 h-4 mr-2 text-red-500' />
                        <span className='text-sm'>{listing.address}</span>
                      </div>
                      <div className='flex flex-wrap items-center gap-3'>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          listing.type === 'rent' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        }`}>
                          {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                        {listing.offer && (
                          <span className='bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium'>
                            Special Offer
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      {listing.offer && (
                        <p className='text-sm text-gray-500 dark:text-gray-400 line-through mb-1'>
                          ₹{new Intl.NumberFormat('en-IN').format(listing.regularPrice)}
                        </p>
                      )}
                      <p className='text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400'>
                        ₹{new Intl.NumberFormat('en-IN').format(listing.offer ? listing.discountPrice : listing.regularPrice)}
                        {listing.type === 'rent' && <span className='text-base text-gray-500 dark:text-gray-400'>/month</span>}
                      </p>
                      {listing.offer && (
                        <p className='text-green-600 dark:text-green-400 text-sm font-medium'>
                          Save ₹{new Intl.NumberFormat('en-IN').format(+listing.regularPrice - +listing.discountPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Room Details */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                  <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-4'>Room Details</h2>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    <div className='flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                      <FaBed className='w-6 h-6 text-blue-600 mr-3' />
                      <div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Bedrooms</p>
                        <p className='font-bold text-gray-800 dark:text-gray-200'>{listing.bedrooms}</p>
                      </div>
                    </div>
                    <div className='flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                      <FaBath className='w-6 h-6 text-cyan-600 mr-3' />
                      <div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Bathrooms</p>
                        <p className='font-bold text-gray-800 dark:text-gray-200'>{listing.bathrooms}</p>
                      </div>
                    </div>
                    <div className='flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                      <FaCar className='w-6 h-6 text-green-600 mr-3' />
                      <div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Parking</p>
                        <p className='font-bold text-gray-800 dark:text-gray-200'>{listing.parking ? 'Available' : 'Not Available'}</p>
                      </div>
                    </div>
                    <div className='flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                      <FaChair className='w-6 h-6 text-purple-600 mr-3' />
                      <div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Furnished</p>
                        <p className='font-bold text-gray-800 dark:text-gray-200'>{listing.furnished ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                  <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-4'>About this PG</h2>
                  <div className='prose dark:prose-invert max-w-none'>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap'>
                      {listing.description}
                    </p>
                  </div>
                </div>
                
                {/* Location Map */}
                {listing.location && listing.location.latitude && listing.location.longitude && (
                  <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-4'>Location</h2>
                    <div className='bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center'>
                      <FaMapMarkerAlt className='w-12 h-12 text-red-500 mx-auto mb-4' />
                      <p className='text-gray-600 dark:text-gray-400 mb-2'>Location Available</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                        Lat: {listing.location.latitude.toFixed(6)}, Long: {listing.location.longitude.toFixed(6)}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${listing.location.latitude},${listing.location.longitude}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200'
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Contact & Actions */}
              <div className='space-y-6'>
                {/* Contact Card */}
                {currentUser && listing.userRef !== currentUser._id && (
                  <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-6'>
                    <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200 mb-4'>Contact PG Owner</h3>
                    
                    {/* Mobile Number */}
                    {listing.mobile && (
                      <div className='space-y-3 mb-6'>
                        <div className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                          <FaPhone className='w-4 h-4 text-green-600 mr-3' />
                          <span className='text-gray-800 dark:text-gray-200 font-medium'>{listing.mobile}</span>
                        </div>
                        <div className='flex space-x-3'>
                          <a
                            href={`tel:${listing.mobile}`}
                            className='flex-1 flex items-center justify-center space-x-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200'
                          >
                            <FaPhone className='w-4 h-4' />
                            <span>Call Now</span>
                          </a>
                          <a
                            href={`https://wa.me/91${listing.mobile}?text=Hi, I'm interested in your PG: ${listing.name}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex-1 flex items-center justify-center space-x-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-200'
                          >
                            <FaWhatsapp className='w-4 h-4' />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className='space-y-3'>
                      {currentUser && currentUser.role === 'tenant' && listing.userRef !== currentUser._id && (
                        <button
                          onClick={() => setShowBookingForm(true)}
                          className='w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2'
                        >
                          <FaCalendarAlt className='w-4 h-4' />
                          <span>Book Now</span>
                        </button>
                      )}
                      
                      {!contact ? (
                        <button
                          onClick={() => setContact(true)}
                          className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200'
                        >
                          Send Message
                        </button>
                      ) : (
                        <div className='border-t pt-4'>
                          <Contact listing={listing} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Booking Modal */}
      {listing && (
        <BookingModal
          listing={listing}
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </main>
  );
}
