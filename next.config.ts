import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
};

module.exports = {
    images: {
        remotePatterns: [
            new URL('https://mnn7135.github.io/personalWeb/static/media/**'),
            new URL(
                'https://raw.githubusercontent.com/mnn7135/personalWeb/refs/heads/master/src/client/pages/images/**'
            )
        ]
    }
};

export default nextConfig;
