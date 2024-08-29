/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/seed/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/photos/**',
            },
            //https://i.pinimg.com/474x/a6/2a/11/a62a11669c3f57aae66c245f1f2f5b0c.jpg
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
                port: '',
                pathname: '/474x/**',
            }

        ]
    }
};


export default nextConfig;
