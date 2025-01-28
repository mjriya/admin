/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Specify the Cloudinary hostname
        port: '', // You can leave this empty if it's not needed
        pathname: '/**', // This will allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;
