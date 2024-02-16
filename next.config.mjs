/** @type {import('next').NextConfig} */
const nextConfig = {
    // cssModules: true,
    // cssLoaderOptions: {
    //     importLoaders: 1,
    //     localIdentName: "[]",
    // },
    // Allow images from cdn.sanity.io
    images: {
        remotePatterns: ["cdn.sanity.io"],
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
