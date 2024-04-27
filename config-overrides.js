module.exports = function override(config, env) {
  // Add to the existing fallbacks
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "url": require.resolve("url"), // Add this line
  };

  return config;
};


