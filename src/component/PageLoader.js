
import React, { useState, useEffect } from 'react';

export const PageLoader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    const loadingTexts = [
      'Loading',
      'Initializing',
      'Preparing workspace',
      'Almost ready',
      'Welcome'
    ];

    let currentTextIndex = 0;
    let progressInterval;
    let textInterval;

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onLoadComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Text animation
    textInterval = setInterval(() => {
      setLoadingText(loadingTexts[currentTextIndex]);
      currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="logo-animation">
          <div className="logo-text">
            <span className="letter a">A</span>
            <span className="letter r">R</span>
            <span className="letter y">Y</span>
            <span className="letter a2">A</span>
            <span className="letter v">V</span>
            <span className="letter h">H</span>
            <span className="letter i">I</span>
            <span className="letter r2">R</span>
          </div>
          <div className="subtitle">Full Stack Developer</div>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-text">{loadingText}...</div>
          <div className="loading-percentage">{Math.round(progress)}%</div>
        </div>
        
        <div className="loading-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
      </div>
    </div>
  );
};
