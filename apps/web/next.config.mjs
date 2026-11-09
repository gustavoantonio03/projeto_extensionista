/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  transpilePackages: ["@siglo/ui"],
  serverExternalPackages: ["firebase", "@firebase/app", "@firebase/auth", "@firebase/firestore"],
};

export default nextConfig;
