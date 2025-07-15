
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Ignore source map warnings for MediaPipe
  const originalWarn = console.warn;
  console.warn = function(warning) {
    if (warning.includes('Failed to parse source map') && warning.includes('@mediapipe')) {
      return;
    }
    originalWarn.apply(console, arguments);
  };
};
