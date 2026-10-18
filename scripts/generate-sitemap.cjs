const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');
let envSite = process.env.VITE_SITE_URL || process.env.SITE_URL || '';
if (!envSite) {
  try {
    const line = fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/).find(item => /^\s*VITE_SITE_URL\s*=/.test(item));
    envSite = line ? line.replace(/^\s*VITE_SITE_URL\s*=\s*/, '').replace(/^['"]|['"]$/g, '') : '';
  } catch { /* no local env file */ }
}
const base = envSite.replace(/\/$/, '');
const routes = ['', 'about', 'projects', 'skills', 'resume', 'services', 'testimonials', 'contact'];
if (!base || !/^https:\/\//i.test(base)) {
  console.warn('Sitemap URL not configured: set VITE_SITE_URL to the canonical HTTPS site URL before production deployment.');
  process.exit(0);
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${base}/${route}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(pub, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(pub, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nSitemap: ${base}/sitemap.xml\n`);
