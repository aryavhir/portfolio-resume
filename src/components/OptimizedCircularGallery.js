import React, { memo, useState, useEffect } from 'react';

// Progressive image loading is now implemented directly in the component

const OptimizedCircularGallery = memo(({ 
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.02
}) => {
  const [CircularGallery, setCircularGallery] = useState(null);
  const [certImages, setCertImages] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);


  useEffect(() => {
    let mounted = true;
    const loadComponents = async () => {
      try {
        // Load component first
        const { default: GalleryComponent } = await import('../asset/cert/CircularGallery');
        if (!mounted) return;
        setCircularGallery(() => GalleryComponent);

        // Load all images at once
        const imageModules = [
          () => import('../asset/cert/images/1x.png'),
          () => import('../asset/cert/images/2.png'),
          () => import('../asset/cert/images/3.png'),
          () => import('../asset/cert/images/4.png'),
          () => import('../asset/cert/images/5.png'),
          () => import('../asset/cert/images/6.png'),
          () => import('../asset/cert/images/7.png'),
          () => import('../asset/cert/images/8.png'),
          () => import('../asset/cert/images/9.png'),
          () => import('../asset/cert/images/10.png'),
          () => import('../asset/cert/images/11.png'),
          () => import('../asset/cert/images/12.png'),
          () => import('../asset/cert/images/13.png'),
          () => import('../asset/cert/images/14.png'),
          () => import('../asset/cert/images/15.png'),
        ];

        const titles = [
          'Google cybersecurity', 'Version control', 'Programming Fundamentals In Swift',
          'React Basics', 'Mobile Development', 'Advanced Programming In Swift',
          'Principles Of UX/UI Design', 'Network And Network Security', 'Cybersecurity Task',
          'Detection And Response', 'Linux And SQL', 'Asset,Threat And Vulnerability',
          'Foundation of Cybersecurity', 'Put It To Work', 'Security Risks'
        ];

        // Load all images before rendering
        const allImages = await Promise.all(imageModules.map(loader => loader()));
        if (mounted) {
          const items = allImages.map((img, index) => ({
            image: img.default,
            text: titles[index]
          }));
          setCertImages(items);
          setLoadingProgress(items.length);
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

  if (!CircularGallery || certImages.length === 0) {
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
          <div style={{ marginBottom: '10px' }}>
            Loading certificates... ({loadingProgress}/15)
          </div>
          <div 
            style={{
              width: '200px',
              height: '3px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(loadingProgress / 15) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #AA367C, #4A2FBD)',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <CircularGallery
      items={certImages}
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