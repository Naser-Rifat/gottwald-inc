import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "80",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "gottwald-backend.onrender.com",
        pathname: "/media/**",
      },
    ],
  },

  // Enable WASM support for Rapier3D physics via webpack
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },

  // Empty turbopack config to allow coexistence with webpack config
  turbopack: {},
};

export default nextConfig;
