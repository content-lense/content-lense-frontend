/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
};

const { i18n } = require("./next-i18next.config");

module.exports = { ...nextConfig, i18n };
