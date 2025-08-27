/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://wordwanderer.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/dashboard',
    '/new-dashboard',
    '/admin/*',
    '/api/*',
    '/temp/*',
    '/archive/*'
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/login'),
    await config.transform(config, '/register'),
    await config.transform(config, '/courses'),
    await config.transform(config, '/learn/chinese'),
    await config.transform(config, '/demo'),
    await config.transform(config, '/chinese-demo'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/new-dashboard',
          '/admin',
          '/api',
          '/temp',
          '/archive'
        ],
      },
    ],
    additionalSitemaps: [
      'https://wordwanderer.vercel.app/sitemap.xml',
    ],
  },
}
