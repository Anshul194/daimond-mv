import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  transpilePackages: ["gsap"],
  serverExternalPackages: ["nodemailer"],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        assert: false,
        constants: false,
        events: false,
      };

      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^fast-glob$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^@nodelib\/fs/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /@nodelib\/fs/,
          contextRegExp: /node_modules/,
        })
      );

      config.resolve.alias = {
        ...config.resolve.alias,
        '@nodelib/fs.scandir': resolve(__dirname, './lib/empty-fs-module.js'),
        '@nodelib/fs.stat': resolve(__dirname, './lib/empty-fs-module.js'),
        '@nodelib/fs.walk': resolve(__dirname, './lib/empty-fs-module.js'),
        'fast-glob': resolve(__dirname, './lib/empty-glob-module.js'),
      };
    }

    return config;
  },
};

export default nextConfig;