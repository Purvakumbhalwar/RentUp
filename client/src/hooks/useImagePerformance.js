import { useState, useEffect, useCallback } from 'react';

export const useImagePerformance = () => {
  const [metrics, setMetrics] = useState({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    loadTimes: []
  });

  const trackImageLoad = useCallback((url, startTime) => {
    const loadTime = performance.now() - startTime;
    
    setMetrics(prev => {
      const newLoadTimes = [...prev.loadTimes, loadTime];
      const averageLoadTime = newLoadTimes.reduce((sum, time) => sum + time, 0) / newLoadTimes.length;
      
      return {
        ...prev,
        loadedImages: prev.loadedImages + 1,
        averageLoadTime: Math.round(averageLoadTime),
        loadTimes: newLoadTimes.slice(-50) // Keep only last 50 load times
      };
    });
    
    // Log performance for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image loaded in ${Math.round(loadTime)}ms: ${url.substring(0, 50)}...`);
    }
  }, []);

  const trackImageError = useCallback((url) => {
    setMetrics(prev => ({
      ...prev,
      failedImages: prev.failedImages + 1
    }));
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to load image: ${url.substring(0, 50)}...`);
    }
  }, []);

  const trackImageStart = useCallback((url) => {
    setMetrics(prev => ({
      ...prev,
      totalImages: prev.totalImages + 1
    }));
    
    return performance.now();
  }, []);

  const getLoadingProgress = useCallback(() => {
    if (metrics.totalImages === 0) return 0;
    return Math.round((metrics.loadedImages / metrics.totalImages) * 100);
  }, [metrics.totalImages, metrics.loadedImages]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      loadTimes: []
    });
  }, []);

  return {
    metrics,
    trackImageStart,
    trackImageLoad,
    trackImageError,
    getLoadingProgress,
    resetMetrics
  };
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const elementRef = useCallback((node) => {
    if (node !== null) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = entry.isIntersecting;
          setIsIntersecting(isVisible);
          
          if (isVisible && !hasBeenVisible) {
            setHasBeenVisible(true);
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
          ...options
        }
      );

      observer.observe(node);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [hasBeenVisible, options]);

  return { elementRef, isIntersecting, hasBeenVisible };
};

// Hook for preloading images
export const useImagePreloader = () => {
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [preloadingImages, setPreloadingImages] = useState(new Set());

  const preloadImage = useCallback(async (src) => {
    if (preloadedImages.has(src) || preloadingImages.has(src)) {
      return true;
    }

    setPreloadingImages(prev => new Set(prev).add(src));

    try {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

      setPreloadedImages(prev => new Set(prev).add(src));
      setPreloadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });

      return true;
    } catch (error) {
      setPreloadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
      
      console.error('Failed to preload image:', src);
      return false;
    }
  }, [preloadedImages, preloadingImages]);

  const preloadImages = useCallback(async (urls) => {
    const results = await Promise.allSettled(
      urls.map(url => preloadImage(url))
    );
    
    return results.map((result, index) => ({
      url: urls[index],
      success: result.status === 'fulfilled' && result.value
    }));
  }, [preloadImage]);

  const isPreloaded = useCallback((src) => {
    return preloadedImages.has(src);
  }, [preloadedImages]);

  const isPreloading = useCallback((src) => {
    return preloadingImages.has(src);
  }, [preloadingImages]);

  return {
    preloadImage,
    preloadImages,
    isPreloaded,
    isPreloading,
    preloadedCount: preloadedImages.size,
    preloadingCount: preloadingImages.size
  };
};
