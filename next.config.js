const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    position: 'bottom-right',
  },
  // Disable development features that might access localStorage
  /* compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }, */
  
  // Add headers for sitemap.xml
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
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