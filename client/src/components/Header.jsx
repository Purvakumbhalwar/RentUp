import { FaSearch, FaHeart, FaCalendarAlt, FaHome, FaBars, FaTimes, FaUser, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    
    if (searchTerm.trim()) {
      urlParams.set('searchTerm', searchTerm.trim());
    }
    if (location.trim()) {
      urlParams.set('location', location.trim());
    }
    
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const locationFromUrl = urlParams.get('location');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    if (locationFromUrl) {
      setLocation(locationFromUrl);
    }
  }, [window.location.search]);
  
  return (
    <header className='bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2 group'>
          <div className='bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-1.5 sm:p-2 group-hover:shadow-lg transition-all duration-300'>
            <span className='text-white font-bold text-sm sm:text-lg'>R</span>
          </div>
          <h1 className='font-bold text-lg sm:text-xl lg:text-2xl flex items-center'>
            <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>Rent</span>
            <span className='text-gray-800 dark:text-gray-200'>Up</span>
          </h1>
        </Link>

        {/* Search Form */}
        <div className='hidden sm:block relative'>
          <form
            onSubmit={handleSubmit}
            className='flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300'
          >
            <div className='flex items-center space-x-2 flex-1'>
              <input
                type='text'
                placeholder='Search PGs...'
                className='bg-transparent focus:outline-none w-20 sm:w-24 md:w-32 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className='h-4 w-px bg-gray-300 dark:bg-gray-600'></div>
              <input
                type='text'
                placeholder='Location...'
                className='bg-transparent focus:outline-none w-20 sm:w-24 md:w-32 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type='submit' className='ml-2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200'>
              <FaSearch className='text-gray-600 dark:text-gray-400 w-3 h-3 sm:w-4 sm:h-4' />
            </button>
          </form>
        </div>

        {/* Navigation */}
        <div className='flex items-center space-x-2 sm:space-x-4'>
          {/* Mobile Search Button */}
          <form onSubmit={handleSubmit} className='sm:hidden'>
            <button type='submit' className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'>
              <FaSearch className='text-gray-600 dark:text-gray-400 w-4 h-4' />
            </button>
          </form>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
            aria-label='Toggle mobile menu'
          >
            {mobileMenuOpen ? (
              <FaTimes className='text-gray-600 dark:text-gray-400 w-5 h-5' />
            ) : (
              <FaBars className='text-gray-600 dark:text-gray-400 w-5 h-5' />
            )}
          </button>
          
          <nav className='hidden md:flex items-center space-x-4 lg:space-x-6'>
            <Link to='/' className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-sm lg:text-base'>
              Home
            </Link>
            <Link to='/about' className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-sm lg:text-base'>
              About
            </Link>
            {currentUser && (
              <>
                {currentUser.role === 'tenant' && (
                  <>
                    <Link to='/wishlist' className='text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors duration-200 text-sm lg:text-base flex items-center space-x-1'>
                      <FaHeart className='w-3 h-3' />
                      <span>Wishlist</span>
                    </Link>
                    <Link to='/my-bookings' className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-sm lg:text-base flex items-center space-x-1'>
                      <FaCalendarAlt className='w-3 h-3' />
                      <span>My Bookings</span>
                    </Link>
                  </>
                )}
                {currentUser.role === 'owner' && (
                  <Link to='/owner-dashboard' className='text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 text-sm lg:text-base flex items-center space-x-1'>
                    <FaHome className='w-3 h-3' />
                    <span>Dashboard</span>
                  </Link>
                )}
              </>
            )}
          </nav>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Profile/Sign In */}
          <Link to='/profile'>
            {currentUser ? (
              <div className='flex items-center space-x-1 sm:space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'>
                <img
                  className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600'
                  src={currentUser.avatar}
                  alt='profile'
                />
                <span className='hidden lg:inline text-gray-700 dark:text-gray-300 font-medium text-sm'>
                  {currentUser.username}
                </span>
              </div>
            ) : (
              <button className='btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200'>
                Sign In
              </button>
            )}
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='md:hidden fixed inset-0 z-50 bg-black bg-opacity-50' onClick={() => setMobileMenuOpen(false)}>
          <div 
            className='absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
              >
                <FaTimes className='text-gray-600 dark:text-gray-400 w-5 h-5' />
              </button>
            </div>
            
            {/* Mobile Menu Content */}
            <div className='p-4 space-y-6'>
              {/* User Info */}
              {currentUser && (
                <div className='flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl'>
                  <img
                    className='w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600'
                    src={currentUser.avatar}
                    alt='profile'
                  />
                  <div className='flex-1'>
                    <h4 className='font-medium text-gray-800 dark:text-gray-200'>{currentUser.username}</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
                      {currentUser.role || 'tenant'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Mobile Search */}
              <div className='sm:hidden'>
                <form onSubmit={handleSubmit} className='space-y-3'>
                  <input
                    type='text'
                    placeholder='Search PGs...'
                    className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <input
                    type='text'
                    placeholder='Location...'
                    className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button
                    type='submit'
                    className='w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200'
                  >
                    <FaSearch className='w-4 h-4' />
                    <span>Search</span>
                  </button>
                </form>
              </div>
              
              {/* Navigation Links */}
              <nav className='space-y-2'>
                <Link
                  to='/'
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                >
                  <FaHome className='w-5 h-5' />
                  <span className='font-medium'>Home</span>
                </Link>
                
                <Link
                  to='/about'
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                >
                  <span className='font-medium'>About</span>
                </Link>
                
                {currentUser ? (
                  <>
                    {/* Tenant Navigation */}
                    {currentUser.role === 'tenant' && (
                      <>
                        <Link
                          to='/wishlist'
                          onClick={() => setMobileMenuOpen(false)}
                          className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                        >
                          <FaHeart className='w-5 h-5 text-red-500' />
                          <span className='font-medium'>My Wishlist</span>
                        </Link>
                        
                        <Link
                          to='/my-bookings'
                          onClick={() => setMobileMenuOpen(false)}
                          className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                        >
                          <FaCalendarAlt className='w-5 h-5 text-blue-500' />
                          <span className='font-medium'>My Bookings</span>
                        </Link>
                      </>
                    )}
                    
                    {/* Owner Navigation */}
                    {currentUser.role === 'owner' && (
                      <>
                        <Link
                          to='/create-listing'
                          onClick={() => setMobileMenuOpen(false)}
                          className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                        >
                          <FaPlus className='w-5 h-5 text-green-500' />
                          <span className='font-medium'>Create Listing</span>
                        </Link>
                        
                        <Link
                          to='/owner-dashboard'
                          onClick={() => setMobileMenuOpen(false)}
                          className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                        >
                          <FaHome className='w-5 h-5 text-green-500' />
                          <span className='font-medium'>Owner Dashboard</span>
                        </Link>
                      </>
                    )}
                    
                    {/* No Role Set */}
                    {!currentUser.role && (
                      <div className='p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Please set your role in profile to access features</p>
                      </div>
                    )}
                    
                    <Link
                      to='/profile'
                      onClick={() => setMobileMenuOpen(false)}
                      className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200'
                    >
                      <FaUser className='w-5 h-5' />
                      <span className='font-medium'>My Profile</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to='/sign-in'
                    onClick={() => setMobileMenuOpen(false)}
                    className='flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200'
                  >
                    <FaUser className='w-4 h-4' />
                    <span>Sign In</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
