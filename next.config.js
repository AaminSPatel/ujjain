const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    position:'bottom-right',
  },
  // Disable development features that might access localStorage
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

// Conditionally apply PWA only in production
if (process.env.NODE_ENV === 'production') {
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // Disable in dev if needed
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}