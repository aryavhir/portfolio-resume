
import React, { useState, useEffect } from 'react';

export const PageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-logo">
          Aryavhir
        </div>
        <div className="loader-bar">
          <div 
            className="loader-progress" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          marginTop: '1rem',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Loading Experience...
        </p>
      </div>
    </div>
  );
};
