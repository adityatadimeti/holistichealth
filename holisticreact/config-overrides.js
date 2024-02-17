const webpack = require('webpack');

module.exports = function override(config, env) {
    // Override webpack configuration here
    // Add a fallback for the crypto module
    config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/"),
    };

    // Return the updated config
    return config;
};
