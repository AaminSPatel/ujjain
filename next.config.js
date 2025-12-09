/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // You can add other image hostnames here if needed
    ],
  },
  
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
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // ADD THIS TURBOPACK CONFIGURATION
  turbopack: {
    // Disable Turbopack for production builds when PWA is enabled
    enabled: process.env.NODE_ENV !== 'production',
    
    // Or you can try with these options if you want Turbopack in dev:
    // resolveAlias: {},
    // resolveExtensions: [],
  },
};

// Conditionally apply PWA only in production
if (process.env.NODE_ENV === 'production') {
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}