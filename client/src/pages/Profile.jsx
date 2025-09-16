import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaImage, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaHome, FaHeart, FaCalendarAlt } from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [wishlistCounts, setWishlistCounts] = useState({});
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const fetchWishlistCounts = async () => {
    try {
      const res = await fetch('/api/wishlist/counts/all');
      const data = await res.json();
      if (data.success) {
        setWishlistCounts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist counts:', error);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      // Fetch wishlist counts after getting listings
      fetchWishlistCounts();
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='animate-fadeIn'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center space-x-3 mb-4'>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200'>
                My Profile
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentUser.role === 'owner'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : currentUser.role === 'tenant'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
              }`}>
                {currentUser.role === 'owner' 
                  ? '🏠 PG Owner' 
                  : currentUser.role === 'tenant'
                  ? '🎓 Student/Tenant'
                  : '👤 User (Set Role)'
                }
              </span>
            </div>
            <p className='text-gray-600 dark:text-gray-400'>
              {currentUser.role === 'owner' 
                ? 'Manage your account and PG listings'
                : 'Manage your account and find perfect PGs'
              }
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column - Profile Info */}
            <div className='lg:col-span-2'>
              {/* Profile Card */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6'>
                <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-6'>Profile Information</h2>
                
                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Avatar Upload */}
                  <div className='flex flex-col items-center mb-6'>
                    <input
                      onChange={(e) => setFile(e.target.files[0])}
                      type='file'
                      ref={fileRef}
                      hidden
                      accept='image/*'
                    />
                    <div className='relative group'>
                      <img
                        onClick={() => fileRef.current.click()}
                        src={formData.avatar || currentUser.avatar}
                        alt='profile'
                        className='rounded-full h-24 w-24 sm:h-32 sm:w-32 object-cover cursor-pointer border-4 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-all duration-200'
                      />
                      <div className='absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer'>
                        <FaImage className='text-white text-xl' />
                      </div>
                    </div>
                    
                    {/* Upload Status */}
                    <div className='mt-3 text-center'>
                      {fileUploadError ? (
                        <span className='text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg'>
                          Error: Image must be less than 2MB
                        </span>
                      ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-blue-600 dark:text-blue-400 text-sm'>
                          Uploading {filePerc}%
                        </span>
                      ) : filePerc === 100 ? (
                        <span className='text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg'>
                          Image uploaded successfully!
                        </span>
                      ) : (
                        <span className='text-gray-500 dark:text-gray-400 text-sm'>
                          Click to change profile picture
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className='space-y-4'>
                    {/* Username */}
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center'>
                        <FaUser className='w-4 h-4 mr-2' />
                        Username
                      </label>
                      <input
                        type='text'
                        placeholder='Enter your username'
                        defaultValue={currentUser.username}
                        id='username'
                        className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        onChange={handleChange}
                      />
                    </div>

                    {/* Email */}
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center'>
                        <FaEnvelope className='w-4 h-4 mr-2' />
                        Email
                      </label>
                      <input
                        type='email'
                        placeholder='Enter your email'
                        id='email'
                        defaultValue={currentUser.email}
                        className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='flex-1 btn-primary py-3 px-4 rounded-xl font-medium hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200'
                    >
                      {loading ? (
                        <div className='flex items-center justify-center space-x-2'>
                          <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                          <span>Updating...</span>
                        </div>
                      ) : 'Update Profile'}
                    </button>
                    
                    {currentUser.role === 'owner' && (
                      <Link
                        to='/create-listing'
                        className='flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-200'
                      >
                        <FaPlus className='w-4 h-4' />
                        <span>Create PG Listing</span>
                      </Link>
                    )}
                  </div>
                </form>

                {/* Status Messages */}
                {error && (
                  <div className='mt-4 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
                    {error}
                  </div>
                )}
                
                {updateSuccess && (
                  <div className='mt-4 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
                    Profile updated successfully!
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Account Actions */}
            <div className='space-y-6'>
              {/* Quick Actions Card */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200 mb-4'>Quick Actions</h3>
                
                <div className='space-y-3'>
                  {/* Role-based Dashboard Links */}
                  {currentUser.role === 'tenant' && (
                    <>
                      <Link
                        to='/wishlist'
                        className='w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200'
                      >
                        <FaHeart className='w-4 h-4' />
                        <span>My Wishlist</span>
                      </Link>
                      
                      <Link
                        to='/my-bookings'
                        className='w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200'
                      >
                        <FaCalendarAlt className='w-4 h-4' />
                        <span>My Bookings</span>
                      </Link>
                    </>
                  )}
                  
                  {currentUser.role === 'owner' && (
                    <>
                      <Link
                        to='/owner-dashboard'
                        className='w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200'
                      >
                        <FaHome className='w-4 h-4' />
                        <span>Owner Dashboard</span>
                      </Link>
                      
                      <button
                        onClick={handleShowListings}
                        className='w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200'
                      >
                        <FaHome className='w-4 h-4' />
                        <span>View My Listings</span>
                      </button>
                    </>
                  )}
                  
                  {/* For users without role assigned, show basic options */}
                  {!currentUser.role && (
                    <div className='p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center'>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>Please set your role to access personalized features</p>
                      <Link
                        to='/profile'
                        className='inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors'
                      >
                        Update Profile
                      </Link>
                    </div>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className='w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors duration-200'
                  >
                    <FaSignOutAlt className='w-4 h-4' />
                    <span>Sign Out</span>
                  </button>
                </div>
                
                <hr className='my-6 border-gray-200 dark:border-gray-600' />
                
                {/* Danger Zone */}
                <div className='space-y-3'>
                  <h4 className='text-sm font-semibold text-red-600 dark:text-red-400'>Danger Zone</h4>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        handleDeleteUser();
                      }
                    }}
                    className='w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200'
                  >
                    <FaTrash className='w-4 h-4' />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error for listings */}
        {showListingsError && (
          <div className='mt-6 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
            Error loading your listings. Please try again.
          </div>
        )}
        
        {/* Listings Section */}
        {userListings && userListings.length > 0 && (
          <div className='mt-8'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>My PG Listings</h2>
                <p className='text-gray-600 dark:text-gray-400 mt-1'>Manage your property listings</p>
              </div>
              
              <div className='p-6'>
                <div className='grid gap-4'>
                  {userListings.map((listing) => (
                    <div
                      key={listing._id}
                      className='group bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200'
                    >
                      <div className='flex items-center space-x-4'>
                        {/* Listing Image */}
                        <Link to={`/listing/${listing._id}`} className='flex-shrink-0'>
                          <img
                            src={listing.imageUrls[0]}
                            alt='listing cover'
                            className='h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200'
                          />
                        </Link>
                        
                        {/* Listing Info */}
                        <div className='flex-1 min-w-0'>
                          <Link
                            to={`/listing/${listing._id}`}
                            className='block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'
                          >
                            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 truncate'>
                              {listing.name}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                              {listing.address}
                            </p>
                            <div className='flex items-center space-x-4 mt-2'>
                              <span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                                ₹{new Intl.NumberFormat('en-IN').format(listing.offer ? listing.discountPrice : listing.regularPrice)}
                                {listing.type === 'rent' && '/month'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                listing.type === 'rent' 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              }`}>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                              </span>
                              {wishlistCounts[listing._id] > 0 && (
                                <span className='flex items-center text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full'>
                                  <FaHeart className='w-2 h-2 mr-1' />
                                  {wishlistCounts[listing._id]} wishlist{wishlistCounts[listing._id] !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2'>
                          <Link
                            to={`/update-listing/${listing._id}`}
                            className='flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200'
                          >
                            <FaEdit className='w-3 h-3' />
                            <span className='hidden sm:inline'>Edit</span>
                          </Link>
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this listing?')) {
                                handleListingDelete(listing._id);
                              }
                            }}
                            className='flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200'
                          >
                            <FaTrash className='w-3 h-3' />
                            <span className='hidden sm:inline'>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
