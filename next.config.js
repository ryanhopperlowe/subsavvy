/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"],
    },
  },
};

module.exports = nextConfig;
