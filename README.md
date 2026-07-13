# Aphidex Web

This repository contains only the public Aphidex website. The Flutter application lives in [ByteShark-dev/aphidex](https://github.com/ByteShark-dev/aphidex).

- Temporary public URL: `https://byteshark-dev.github.io/aphidex-web/`
- Planned custom domain: `https://aphidex.byteshark.dev/`

## Stack

- Vite
- Tailwind CSS
- Vanilla JavaScript modules

## Install

```bash
npm ci
```

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

The production files are written to `dist/`.

## Deployment

Pushing `main` runs `.github/workflows/deploy-pages.yml`, builds `dist/`, and publishes it through GitHub Pages. In the repository settings, select **GitHub Actions** as the Pages source.

## Central URL configuration

`src/config/site.js` is the single source for `siteConfig.seo.siteUrl`. Canonical URLs, Open Graph, Twitter cards, JSON-LD, `robots.txt`, and `sitemap.xml` derive from it during the build. To move to the planned custom domain, update that value only.

## Project structure

- `index.html`: landing page entry
- `privacy/index.html`: privacy policy page
- `src/config/site.js`: editable copy, links, metrics and screenshot metadata
- `public/app-ads.txt`: ad inventory authorization for the companion domain

## Content updates

The following values are intentionally easy to edit from `src/config/site.js`:

- Google Play and App Store URLs
- Hero copy
- Feature cards
- Metrics
- Screenshot captions
- Supported languages list
- Legal note
- Privacy page text

## Notes

- The project uses relative paths so it works at the repository root, `/privacy/`, and under the GitHub Pages project path.
- Review the privacy copy before using it as a final store policy if the app data flows change.
