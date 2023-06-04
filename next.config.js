const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const ContentSecurityPolicy =
  // 'style-src' specifies which stylesheets the user agent can load for a given webpage
  // 'self' allows loading resources from the same origin (same scheme, host and port)
  // 'unsafe-inline' allows use of inline resources, like inline <style> elements and onclick
  // https://fonts.googleapis.com is allowed as a source of stylesheets
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  // 'img-src' specifies which images the user agent can load for a given webpage
  // '*' allows loading resources from anywhere
  // 'blob:' allows images loaded from a Blob or Data URL
  // 'data:' allows images to be embedded directly within your HTML or CSS, reducing additional HTTP requests
  'img-src * blob: data:; ' +
  // 'font-src' specifies which font the user agent can load for a given webpage
  // 'self', https://fonts.googleapis.com and https://fonts.gstatic.com are allowed as a source of fonts
  "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
  // 'media-src' specifies which media the user agent can load for a given webpage
  // 'none' means no URLs can be loaded for this resource type
  "media-src 'none'; " +
  // 'connect-src' restricts the URLs which can be loaded using script interfaces
  // '*' allows loading resources from anywhere
  'connect-src *; ' +
  // 'frame-src' specifies valid sources for nested browsing contexts loading using elements such as <frame>, <iframe>, <embed>, or <object>
  // 'https://www.youtube.com' and 'https://vercel.live' are allowed as sources of frames
  'frame-src https://www.youtube.com https://vercel.live;'

const securityHeaders = [
  // Content-Security-Policy is a response header that browsers use to enhance the security of a document by allowing web developers to control resources the user agent is allowed to load
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  // Referrer-Policy is a response header that controls how much referrer information (sent via the Referer header) should be included with requests
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // The X-Content-Type-Options response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should not be changed and be followed
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // The X-DNS-Prefetch-Control HTTP response header controls DNS prefetching, a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth.
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // HTTP Strict Transport Security (HSTS) lets a web site tell browsers that
]

module.exports = withBundleAnalyzer({
  images: {
    domains: ['media.graphassets.com', 'cdn.weatherapi.com'],
  },
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!dev && !isServer) {
      // Replace React with Preact only in client production build
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/',
        permanent: true,
      },
      // more redirects here as needed
    ]
  },
})
