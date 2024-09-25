/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://www.hunmogu.com', // Replace with your site's URL
  generateRobotsTxt: true, // (optional) Generate a robots.txt file
  changefreq: 'daily',
  sitemapSize: 7000,
  exclude: ['/api/*', '/_not-found'],
};
