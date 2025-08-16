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
            ),
            new URL('https://images.icon-icons.com/**'),
            new URL('https://wiki.mabinogiworld.com/images/**'),
            new URL('https://pbs.twimg.com/profile_images/**'),
            new URL(
                'https://static.wikia.nocookie.net/logopedia/images/7/70/NationStates_Logo_%282002%2C_Badge%29.png/revision/latest?cb=20230218231545'
            )
        ]
    }
};

export default nextConfig;
