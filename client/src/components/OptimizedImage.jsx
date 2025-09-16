import { useState, useEffect } from 'react';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy', 
  priority = false,
  skeltonClassName = '',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
  fallbackSrc = 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [webpSupported, setWebpSupported] = useState(false);

  // Check WebP support
  useEffect(() => {
    const checkWebpSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const dataURL = canvas.toDataURL('image/webp');
      setWebpSupported(dataURL.indexOf('image/webp') === 5);
    };
    checkWebpSupport();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      // Try fallback image
      e.target.src = fallbackSrc;
    } else {
      setImageLoaded(true);
    }
  };

  // Optimize image URL with format conversion and compression
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return fallbackSrc;
    if (imageError) return fallbackSrc;
    
    // Add query parameters for Firebase/Google Cloud images
    if (originalSrc.includes('firebasestorage.googleapis.com') || originalSrc.includes('googleapis.com')) {
      const separator = originalSrc.includes('?') ? '&' : '?';
      let optimizedUrl = originalSrc;
      
      // Add compression and format optimization
      if (webpSupported) {
        optimizedUrl += `${separator}format=webp&quality=80`;
      } else {
        optimizedUrl += `${separator}quality=80`;
      }
      
      return optimizedUrl;
    }
    
    return originalSrc;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      {!imageLoaded && (
        <div 
          className={`absolute inset-0 ${skeltonClassName}`}
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Skeleton/Loading State */}
      {!imageLoaded && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${skeltonClassName}`}>
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 opacity-50"></div>
        </div>
      )}
      
      {/* Actual Image */}
      <img
        src={getOptimizedSrc(src)}
        alt={alt}
        className={`${className} transition-all duration-500 ease-out ${
          imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
        }`}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
