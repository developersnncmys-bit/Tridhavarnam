/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disabled: React 18 strict mode double-invokes effects in dev, which
  // interacts badly with GSAP ScrollTrigger cleanup in Next.js 14.2.13 and
  // surfaces NotFoundError ("removeChild") during navigation.
  reactStrictMode: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // The dev environment's image optimizer is returning empty bodies for
    // every image (sharp likely failed to bind). Bypass the optimizer and
    // serve files directly from /public.
    unoptimized: true,
  },
};

export default nextConfig;
