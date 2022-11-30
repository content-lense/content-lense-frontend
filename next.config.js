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
  experimental: {
    modularizeImports: {
      "@mui/material": {
        transform: "@mui/material/{{member}}",
      },
      "@mui/icons-material": {
        transform: "@mui/icons-material/{{member}}",
      },
    },
  },
};

const { i18n } = require("./next-i18next.config");
const withTM = require('next-transpile-modules')(['reaviz']);

module.exports = withTM({ ...nextConfig, i18n });
