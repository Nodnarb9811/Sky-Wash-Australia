/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static, host-anywhere output (this is a one-page client experience —
  // no SSR/server features). `next build` writes to out/, then the build script
  // moves it to dist/ so it serves as a plain static site on any host.
  output: "export",
  images: { unoptimized: true },
  // three / R3F ship ESM that benefits from transpilation in Next.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  // ESLint isn't configured in this milestone; keep TS type-checking on.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
