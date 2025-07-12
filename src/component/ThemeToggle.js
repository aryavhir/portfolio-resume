
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button 
      variant="outline-primary" 
      onClick={toggleTheme}
      className="theme-toggle"
      style={{ border: 'none', background: 'transparent' }}
    >
      {darkMode ? '☀️' : '🌙'}
    </Button>
  );
};
