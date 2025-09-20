import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`} {...props}>
      {!isInView ? (
        <img 
          src={placeholder} 
          alt={alt}
          className="lazy-image-placeholder"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(2px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="lazy-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded && !hasError ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {hasError && (
        <div 
          className="lazy-image-error"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            textAlign: 'center'
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default LazyImage;