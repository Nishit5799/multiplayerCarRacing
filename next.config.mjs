const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
  },
};

export default nextConfig;
