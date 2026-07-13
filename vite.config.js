import { resolve } from 'node:path';

import { defineConfig } from 'vite';

import {
  getPageContent,
  getPageSeo,
  getPageStructuredData,
  getStaticLocale,
  siteConfig,
} from './src/config/site.js';
import { renderLandingPage } from './src/components/LandingPage.js';
import { renderPrivacyPage } from './src/components/PrivacyPage.js';

function getPageKeyFromContext(context) {
  const filename = context?.filename?.replaceAll('\\', '/');
  const path = context?.path?.replaceAll('\\', '/');

  if (filename?.endsWith('/privacy/index.html') || path?.includes('/privacy/')) {
    return 'privacy';
  }

  return 'home';
}

function buildMetaTokens(pageKey) {
  const locale = getStaticLocale(pageKey);
  const seo = getPageSeo(pageKey, locale);
  const structuredData = JSON.stringify(getPageStructuredData(pageKey, locale), null, 2);
  const ogImage = new URL(seo.ogImagePath, seo.siteUrl).toString();
  const ogLocale = locale === 'es' ? 'es_MX' : 'en_US';

  return {
    '%PAGE_TITLE%': seo.title,
    '%PAGE_DESCRIPTION%': seo.description,
    '%PAGE_URL%': seo.pageUrl,
    '%PAGE_OG_IMAGE%': ogImage,
    '%SITE_NAME%': siteConfig.brand.name,
    '%PAGE_AUTHOR%': siteConfig.brand.owner,
    '%OG_TYPE%': seo.ogType,
    '%PAGE_LOCALE%': ogLocale,
    '%TWITTER_CARD%': seo.twitterCard,
    '%STRUCTURED_DATA%': structuredData,
  };
}

function renderStaticPage(pageKey) {
  const locale = getStaticLocale(pageKey);
  const content = getPageContent(pageKey, locale);

  return pageKey === 'privacy' ? renderPrivacyPage(content) : renderLandingPage(content);
}

function buildRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', siteConfig.seo.siteUrl).toString()}\n`;
}

function buildSitemapXml() {
  const pages = ['home', 'privacy'];
  const urls = pages
    .map((pageKey) => {
      const seo = getPageSeo(pageKey, getStaticLocale(pageKey));
      const changefreq = pageKey === 'home' ? 'weekly' : 'monthly';
      const priority = pageKey === 'home' ? '1.0' : '0.6';

      return `  <url>\n    <loc>${seo.pageUrl}</loc>\n    <lastmod>2026-06-14</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
      },
    },
  },
  plugins: [
    {
      name: 'aphidex-static-pages',
      transformIndexHtml(html, context) {
        const pageKey = getPageKeyFromContext(context);
        const tokens = {
          ...buildMetaTokens(pageKey),
          '%PAGE_CONTENT%': renderStaticPage(pageKey),
        };

        return Object.entries(tokens).reduce(
          (output, [token, value]) => output.replaceAll(token, value),
          html,
        );
      },
    },
    {
      name: 'aphidex-seo-files',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt() });
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml() });
      },
    },
  ],
});
