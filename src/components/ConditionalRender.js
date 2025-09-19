import React, { useState, useRef, useEffect } from 'react';

const ConditionalRender = ({ 
  children, 
  threshold = 0.1,
  rootMargin = '100px',
  fallback = null,
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasBeenVisible]);

  const shouldRender = once ? hasBeenVisible : isVisible;

  return (
    <div ref={elementRef} style={{ minHeight: shouldRender ? 'auto' : '400px' }}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default ConditionalRender;