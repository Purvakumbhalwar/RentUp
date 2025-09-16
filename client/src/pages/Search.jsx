import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import SearchSuggestions from '../components/SearchSuggestions';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    location: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  const locationInputRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const locationFromUrl = urlParams.get('location');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      locationFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        location: locationFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === 'location') {
      setSidebardata({ ...sidebardata, location: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebardata.searchTerm.trim()) {
      urlParams.set('searchTerm', sidebardata.searchTerm.trim());
    }
    if (sidebardata.location.trim()) {
      urlParams.set('location', sidebardata.location.trim());
    }
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  // Handle suggestion clicks
  const handleLocationSuggestion = (suggestion) => {
    setSidebardata({ ...sidebardata, location: suggestion });
    setShowLocationSuggestions(false);
  };

  const handleSearchSuggestion = (suggestion) => {
    setSidebardata({ ...sidebardata, searchTerm: suggestion });
    setShowSearchSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='lg:w-80 xl:w-96 p-6 bg-white dark:bg-gray-800 border-b lg:border-r border-gray-200 dark:border-gray-700'>
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-4'>Search Filters</h2>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Search Term */}
          <div className='space-y-2 relative' ref={searchInputRef}>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Search PGs
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Enter PG name or keywords...'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              value={sidebardata.searchTerm}
              onChange={handleChange}
              onFocus={() => setShowSearchSuggestions(true)}
            />
            {showSearchSuggestions && (
              <div className='absolute z-10 w-full'>
                <SearchSuggestions 
                  type='search'
                  onSuggestionClick={handleSearchSuggestion}
                />
              </div>
            )}
          </div>

          {/* Location Search */}
          <div className='space-y-2 relative' ref={locationInputRef}>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Location
            </label>
            <input
              type='text'
              id='location'
              placeholder='Enter city, area, or pincode...'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              value={sidebardata.location}
              onChange={handleChange}
              onFocus={() => setShowLocationSuggestions(true)}
            />
            <p className='text-xs text-gray-500 dark:text-gray-400'>E.g., Koramangala, Bangalore, 560034</p>
            {showLocationSuggestions && (
              <div className='absolute z-10 w-full'>
                <SearchSuggestions 
                  type='location'
                  onSuggestionClick={handleLocationSuggestion}
                />
              </div>
            )}
          </div>
          {/* Property Type */}
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>Property Type</label>
            <div className='grid grid-cols-2 gap-3'>
              <label className='flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='all'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>All Types</span>
              </label>
              <label className='flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>For Rent</span>
              </label>
              <label className='flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>For Sale</span>
              </label>
              <label className='flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>Special Offers</span>
              </label>
            </div>
          </div>
          {/* Amenities */}
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>Amenities</label>
            <div className='grid grid-cols-1 gap-3'>
              <label className='flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>Parking Available</span>
              </label>
              <label className='flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>Furnished</span>
              </label>
            </div>
          </div>
          {/* Sort Options */}
          <div className='space-y-2'>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>Sort By</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            >
              <option value='regularPrice_desc'>Price: High to Low</option>
              <option value='regularPrice_asc'>Price: Low to High</option>
              <option value='createdAt_desc'>Newest First</option>
              <option value='createdAt_asc'>Oldest First</option>
            </select>
          </div>
          
          {/* Search Button */}
          <button 
            type='submit'
            className='w-full btn-primary py-3 px-4 rounded-lg font-semibold text-white hover:shadow-md transform hover:scale-105 transition-all duration-200'
          >
            Search PGs
          </button>
        </form>
      </div>
      
      {/* Results Section */}
      <div className='flex-1 p-6'>
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
                PG Search Results
              </h1>
              {!loading && (
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                  {listings.length === 0 ? 'No PGs found' : `Found ${listings.length} PG${listings.length !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>
            
            {/* Quick filters or additional info can go here */}
            {(sidebardata.searchTerm || sidebardata.location) && (
              <div className='flex flex-wrap gap-2'>
                {sidebardata.searchTerm && (
                  <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm'>
                    🔍 {sidebardata.searchTerm}
                  </span>
                )}
                {sidebardata.location && (
                  <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm'>
                    📍 {sidebardata.location}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className='flex items-center justify-center py-12'>
            <div className='flex items-center space-x-3'>
              <div className='animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full'></div>
              <span className='text-gray-600 dark:text-gray-400'>Searching for PGs...</span>
            </div>
          </div>
        )}
        
        {/* No Results */}
        {!loading && listings.length === 0 && (
          <div className='text-center py-12'>
            <div className='max-w-sm mx-auto'>
              <div className='text-6xl mb-4'>🏠</div>
              <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                No PGs Found
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Try adjusting your search criteria or location to find more options.
              </p>
              <button 
                onClick={() => {
                  setSidebardata({
                    searchTerm: '',
                    location: '',
                    type: 'all',
                    parking: false,
                    furnished: false,
                    offer: false,
                    sort: 'created_at',
                    order: 'desc',
                  });
                  navigate('/search');
                }}
                className='btn-primary px-6 py-3 rounded-lg font-medium hover:shadow-md transition-all duration-200'
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Results Grid */}
        {!loading && listings.length > 0 && (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
            
            {/* Load More Button */}
            {showMore && (
              <div className='flex justify-center mt-8'>
                <button
                  onClick={onShowMoreClick}
                  className='bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md'
                >
                  Load More PGs
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
