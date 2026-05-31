/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three / R3F ship ESM that benefits from transpilation in Next.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  // ESLint isn't configured in this milestone; keep TS type-checking on.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
