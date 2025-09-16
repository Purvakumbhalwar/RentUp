import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    mobile: '',
    location: {
      latitude: null,
      longitude: null
    },
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea' ||
      e.target.type === 'tel'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Function to clear location
  const clearLocation = () => {
    setFormData({
      ...formData,
      location: {
        latitude: null,
        longitude: null
      }
    });
    setLocationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 sm:p-6 max-w-6xl mx-auto min-h-screen'>
      <div className='animate-fadeIn'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-center my-6 sm:my-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent px-4'>
          Create a PG Listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-6 lg:gap-8 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col gap-6 flex-1'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Property Name</label>
            <input
              type='text'
              placeholder='Enter property name (e.g., Modern 2BHK Apartment)'
              className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Description</label>
            <textarea
              placeholder='Describe your property in detail...'
              className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-32'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Address</label>
            <input
              type='text'
              placeholder='Enter complete address with city and state'
              className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>
          
          {/* Mobile Number Field */}
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Contact Mobile Number (Optional)</label>
            <input
              type='tel'
              placeholder='Enter your mobile number for inquiries'
              className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              id='mobile'
              maxLength='10'
              onChange={handleChange}
              value={formData.mobile}
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>Students can contact you directly for inquiries</p>
          </div>
          
          {/* Location Sharing */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Share Location (Optional)</label>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Help students find your PG on Google Maps</p>
              </div>
              {formData.location.latitude && formData.location.longitude && (
                <span className='text-green-600 dark:text-green-400 text-sm font-medium flex items-center'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                  Location Set
                </span>
              )}
            </div>
            
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                type='button'
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className='flex-1 flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-all duration-200'
              >
                {locationLoading ? (
                  <>
                    <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                    <span>Getting Location...</span>
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    <span>Share Current Location</span>
                  </>
                )}
              </button>
              
              {(formData.location.latitude && formData.location.longitude) && (
                <button
                  type='button'
                  onClick={clearLocation}
                  className='px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-xl transition-all duration-200'
                >
                  Clear Location
                </button>
              )}
            </div>
            
            {locationError && (
              <p className='text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
                {locationError}
              </p>
            )}
            
            {formData.location.latitude && formData.location.longitude && (
              <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                <p className='text-green-800 dark:text-green-300 text-sm font-medium mb-2'>Location Captured Successfully!</p>
                <p className='text-green-600 dark:text-green-400 text-xs'>
                  Lat: {formData.location.latitude.toFixed(6)}, Long: {formData.location.longitude.toFixed(6)}
                </p>
                <p className='text-green-600 dark:text-green-400 text-xs mt-1'>
                  Students will be able to see your PG location on Google Maps
                </p>
              </div>
            )}
          </div>
          
          <div className='space-y-4'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Property Type & Features</label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
              <div className='flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={formData.type === 'sale'}
                />
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Sale</span>
              </div>
              <div className='flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={formData.type === 'rent'}
                />
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Rent</span>
              </div>
              <div className='flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Parking</span>
              </div>
              <div className='flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Furnished</span>
              </div>
              <div className='flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Special Offer</span>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Bedrooms</label>
              <div className='flex items-center'>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
            </div>
            
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Bathrooms</label>
              <div className='flex items-center'>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
            </div>
            
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Regular Price</label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium'>₹</span>
                <input
                  type='number'
                  id='regularPrice'
                  min='50'
                  max='10000000'
                  required
                  className='w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
              </div>
              {formData.type === 'rent' && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>per month</span>
              )}
            </div>
            
            {formData.offer && (
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Discounted Price</label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium'>₹</span>
                  <input
                    type='number'
                    id='discountPrice'
                    min='0'
                    max='10000000'
                    required
                    className='w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                </div>
                {formData.type === 'rent' && (
                  <span className='text-xs text-gray-500 dark:text-gray-400'>per month</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Image Upload Section */}
        <div className='flex flex-col flex-1 space-y-6'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Property Images</label>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Upload up to 6 images. The first image will be used as the cover photo.
            </p>
          </div>
          
          <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200'
              >
                {uploading ? (
                  <div className='flex items-center space-x-2'>
                    <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                    <span>Uploading...</span>
                  </div>
                ) : 'Upload Images'}
              </button>
            </div>
            
            {imageUploadError && (
              <p className='text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
                {imageUploadError}
              </p>
            )}
          </div>
          
          {/* Image Preview Grid */}
          {formData.imageUrls.length > 0 && (
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                Uploaded Images ({formData.imageUrls.length}/6)
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200'
                  >
                    <img
                      src={url}
                      alt={`Property image ${index + 1}`}
                      className='w-full h-32 object-cover'
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center'>
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </button>
                    </div>
                    {index === 0 && (
                      <div className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold'>
                        Cover Photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading || uploading}
            className='w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200'
          >
            {loading ? (
              <div className='flex items-center justify-center space-x-2'>
                <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
                <span>Creating Listing...</span>
              </div>
            ) : 'Create Property Listing'}
          </button>
          
          {error && (
            <p className='text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
              {error}
            </p>
          )}
        </div>
      </form>
      </div>
    </main>
  );
}
