import React, { memo, useState, useEffect } from 'react';

// Lazy load certificate images
const importCertImages = async () => {
  const images = await Promise.all([
    import('../asset/cert/images/1x.png'),
    import('../asset/cert/images/2.png'),
    import('../asset/cert/images/3.png'),
    import('../asset/cert/images/4.png'),
    import('../asset/cert/images/5.png'),
    import('../asset/cert/images/6.png'),
    import('../asset/cert/images/7.png'),
    import('../asset/cert/images/8.png'),
    import('../asset/cert/images/9.png'),
    import('../asset/cert/images/10.png'),
    import('../asset/cert/images/11.png'),
    import('../asset/cert/images/12.png'),
    import('../asset/cert/images/13.png'),
    import('../asset/cert/images/14.png'),
    import('../asset/cert/images/15.png'),
  ]);
  
  return images.map(img => img.default);
};

const OptimizedCircularGallery = memo(({ 
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.02
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [CircularGallery, setCircularGallery] = useState(null);
  const [certImages, setCertImages] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadComponents = async () => {
      try {
        // Load images and component in parallel
        const [images, { default: GalleryComponent }] = await Promise.all([
          importCertImages(),
          import('../asset/cert/CircularGallery')
        ]);

        if (mounted) {
          setCertImages(images);
          setCircularGallery(() => GalleryComponent);
          setImagesLoaded(true);
        }
      } catch (error) {
        console.warn('Failed to load gallery components:', error);
      }
    };

    loadComponents();

    return () => {
      mounted = false;
    };
  }, []);

  const galleryItems = certImages.map((image, index) => {
    const titles = [
      'Google cybersecurity',
      'Version control',
      'Programming Fundamentals In Swift',
      'React Basics',
      'Mobile Development',
      'Advanced Programming In Swift',
      'Principles Of UX/UI Design',
      'Network And Network Security',
      'Cybersecurity Task',
      'Detection And Response',
      'Linux And SQL',
      'Asset,Threat And Vulnerability',
      'Foundation of Cybersecurity',
      'Put It To Work',
      'Security Risks'
    ];
    
    return {
      image,
      text: titles[index] || `Certificate ${index + 1}`
    };
  });

  if (!imagesLoaded || !CircularGallery) {
    return (
      <div 
        style={{ 
          height: '600px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: textColor,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '10px'
        }}
      >
        <div>
          <div style={{ marginBottom: '10px' }}>Loading certificates...</div>
          <div 
            style={{
              width: '50px',
              height: '3px',
              background: 'linear-gradient(90deg, #AA367C, #4A2FBD)',
              borderRadius: '2px',
              animation: 'loadingPulse 1.5s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <CircularGallery
      items={galleryItems}
      bend={bend}
      textColor={textColor}
      borderRadius={borderRadius}
      scrollSpeed={scrollSpeed}
      scrollEase={scrollEase}
    />
  );
});

OptimizedCircularGallery.displayName = 'OptimizedCircularGallery';

export default OptimizedCircularGallery;