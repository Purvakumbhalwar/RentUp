import { Link } from 'react-router-dom';
import { MdLocationOn, MdBed, MdBathtub, MdLocalOffer } from 'react-icons/md';
import OptimizedImage from './OptimizedImage';

export default function ListingItem({ listing }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className='group bg-white dark:bg-gray-800 shadow-md hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-xl w-full max-w-[400px] mx-auto border border-gray-200 dark:border-gray-700'>
      <Link to={`/listing/${listing._id}`} className='block'>
        <div className='relative overflow-hidden'>
          <OptimizedImage
            src={listing.imageUrls[0]}
            alt='listing cover'
            className='h-[220px] w-full object-cover group-hover:scale-110 transition-transform duration-500'
            skeltonClassName='h-[220px]'
          />
          
          {/* Property Type Badge */}
          <div className='absolute top-3 left-3'>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
              listing.type === 'rent' 
                ? 'bg-blue-600' 
                : 'bg-green-600'
            }`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          
          {/* Offer Badge */}
          {listing.offer && (
            <div className='absolute top-3 right-3'>
              <div className='flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold'>
                <MdLocalOffer className='w-3 h-3' />
                <span>Offer</span>
              </div>
            </div>
          )}
        </div>
        
        <div className='p-3 sm:p-4 flex flex-col gap-3'>
          <h3 className='text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight line-clamp-2'>
            {listing.name}
          </h3>
          
          <div className='flex items-start gap-2'>
            <MdLocationOn className='h-4 w-4 text-red-500 flex-shrink-0 mt-0.5' />
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
              {listing.address}
            </p>
          </div>
          
          <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>
          
          <div className='flex items-center justify-between mt-2'>
            <div className='flex flex-col'>
              {listing.offer && (
                <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through'>
                  {formatPrice(listing.regularPrice)}
                </span>
              )}
              <span className='text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400'>
                {formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
                {listing.type === 'rent' && (
                  <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal'>
                    /month
                  </span>
                )}
              </span>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-200 dark:border-gray-700 gap-2 sm:gap-0'>
            <div className='flex items-center space-x-3 sm:space-x-4 text-gray-600 dark:text-gray-400'>
              <div className='flex items-center space-x-1'>
                <MdBed className='w-3 h-3 sm:w-4 sm:h-4' />
                <span className='text-xs sm:text-sm font-medium'>
                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
              <div className='flex items-center space-x-1'>
                <MdBathtub className='w-3 h-3 sm:w-4 sm:h-4' />
                <span className='text-xs sm:text-sm font-medium'>
                  {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </div>
            </div>
            
            <div className='flex flex-wrap gap-1 sm:gap-2'>
              {listing.parking && (
                <span className='text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-md whitespace-nowrap'>
                  Parking
                </span>
              )}
              {listing.furnished && (
                <span className='text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-md whitespace-nowrap'>
                  Furnished
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
