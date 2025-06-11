/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' ${isDev ? "'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: lh3.googleusercontent.com;
  font-src 'self';
  object-src 'none';
  base-uri 'none';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	/* config options here */
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
					},
				],
			},
		];
	},
};

export default nextConfig;
