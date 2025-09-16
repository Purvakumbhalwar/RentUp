// Image optimization configuration
export const IMAGE_CONFIG = {
  // Lazy loading settings
  lazyLoading: {
    rootMargin: '50px', // Load images 50px before they come into view
    threshold: 0.1
  },
  
  // Image quality settings
  quality: {
    high: 90,
    medium: 80,
    low: 60
  },
  
  // Image sizes for responsive images
  sizes: {
    thumbnail: { width: 400, height: 220 },
    medium: { width: 800, height: 500 },
    large: { width: 1200, height: 800 },
    hero: { width: 1920, height: 600 }
  },
  
  // Compression settings
  compression: {
    webp: {
      quality: 80,
      effort: 4
    },
    jpeg: {
      quality: 85,
      progressive: true
    },
    png: {
      compressionLevel: 8
    }
  },
  
  // Cache settings
  cache: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    maxItems: 100
  },
  
  // Preload settings
  preload: {
    priority: ['hero', 'above-fold'],
    maxPreloadImages: 3
  }
};

// Generate optimized URL for Firebase images
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl) return null;
  
  const {
    width,
    height,
    quality = IMAGE_CONFIG.quality.medium,
    format = 'auto'
  } = options;
  
  // Firebase Storage URL optimization
  if (originalUrl.includes('firebasestorage.googleapis.com')) {
    const baseUrl = originalUrl.split('?')[0];
    const params = new URLSearchParams();
    
    if (width) params.append('w', width);
    if (height) params.append('h', height);
    if (quality) params.append('q', quality);
    if (format !== 'auto') params.append('fm', format);
    
    // Add compression and optimization
    params.append('auto', 'compress,format');
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  return originalUrl;
};

// Check if image format is supported
export const isFormatSupported = (format) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const dataURL = canvas.toDataURL(`image/${format}`);
  return dataURL.indexOf(`image/${format}`) === 5;
};

// Get best supported format
export const getBestFormat = (originalUrl) => {
  // WebP is the best modern format
  if (isFormatSupported('webp')) {
    return 'webp';
  }
  
  // AVIF is even better but less supported
  if (isFormatSupported('avif')) {
    return 'avif';
  }
  
  // Fall back to original format
  if (originalUrl.includes('.png')) return 'png';
  return 'jpeg';
};

// Preload critical images
export const preloadImage = (src, priority = 'high') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    // Set loading priority
    if (priority === 'high') {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    
    img.src = src;
  });
};

// Batch preload multiple images
export const preloadImages = async (urls, maxConcurrent = 3) => {
  const results = [];
  
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(url => preloadImage(url));
    
    try {
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    } catch (error) {
      console.error('Error preloading image batch:', error);
    }
  }
  
  return results;
};
