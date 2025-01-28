/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'], // Add 'res.cloudinary.com' here
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  