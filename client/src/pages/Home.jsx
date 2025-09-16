import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import OptimizedImage from '../components/OptimizedImage';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  // Preload critical images
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };
    
    // Preload first hero image if available
    if (offerListings.length > 0 && offerListings[0].imageUrls[0]) {
      preloadImage(offerListings[0].imageUrls[0]);
    }
  }, [offerListings]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'></div>
        <div className='relative flex flex-col gap-8 py-20 px-6 max-w-7xl mx-auto text-center'>
          <div className='animate-fadeIn'>
            <h1 className='text-gray-800 dark:text-gray-100 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight'>
              Find your perfect <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>PG</span>
              <br className='hidden sm:block' />
              <span className='sm:hidden'> </span>with <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>RentUp</span>
            </h1>
          </div>
          
          <div className='animate-slideIn max-w-3xl mx-auto'>
            <p className='text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed px-4'>
              India's most trusted platform for students to find safe, affordable, and comfortable PG accommodations.
              <br className='hidden sm:block' />
              <span className='sm:hidden'> </span>Discover verified PGs near your college with modern amenities and student-friendly prices.
            </p>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn'>
            <Link
              to={'/search?type=rent'}
              className='btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
            >
              Find PGs Near You
            </Link>
            <Link
              to={'/about'}
              className='px-8 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200'
            >
              Learn More →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Properties Swiper */}
      {offerListings && offerListings.length > 0 && (
        <div className='relative'>
          <Swiper 
            navigation 
            className='h-[400px] sm:h-[500px]'
            autoplay={{ delay: 4000 }}
            loop
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className='relative h-full'>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                    className='h-full'
                  >
                    <div className='absolute inset-0 bg-black bg-opacity-40'></div>
                    <div className='absolute bottom-8 left-8 text-white max-w-md'>
                      <h3 className='text-2xl font-bold mb-2'>{listing.name}</h3>
                      <p className='text-lg mb-4'>{listing.address}</p>
                      <Link 
                        to={`/listing/${listing._id}`}
                        className='inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200'
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Property Listings Sections */}
      <div className='max-w-7xl mx-auto px-6 py-16'>
        <div className='space-y-16'>
          {/* Special Offers Section */}
          {offerListings && offerListings.length > 0 && (
            <section className='animate-fadeIn'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4'>
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                    🔥 Special PG Offers
                  </h2>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Budget-friendly PGs with amazing discounts</p>
                </div>
                <Link 
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center space-x-1 transition-colors duration-200 self-start sm:self-auto' 
                  to={'/search?offer=true'}
                >
                  <span className='text-sm sm:text-base'>View all offers</span>
                  <span>→</span>
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </section>
          )}

          {/* Rental Properties Section */}
          {rentListings && rentListings.length > 0 && (
            <section className='animate-fadeIn'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4'>
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                    🎓 Student PGs for Rent
                  </h2>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Safe and comfortable PGs near colleges</p>
                </div>
                <Link 
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center space-x-1 transition-colors duration-200 self-start sm:self-auto' 
                  to={'/search?type=rent'}
                >
                  <span className='text-sm sm:text-base'>View all PGs</span>
                  <span>→</span>
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </section>
          )}

          {/* Sale Properties Section */}
          {saleListings && saleListings.length > 0 && (
            <section className='animate-fadeIn'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4'>
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                    🏡 PG Properties for Sale
                  </h2>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>Investment opportunities in student areas</p>
                </div>
                <Link 
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center space-x-1 transition-colors duration-200 self-start sm:self-auto' 
                  to={'/search?type=sale'}
                >
                  <span className='text-sm sm:text-base'>View all properties</span>
                  <span>→</span>
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
