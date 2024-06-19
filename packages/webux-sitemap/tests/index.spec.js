import { fetchSitemap } from '../src/libs/sitemap.js';

test('Fetch Sitemap', async () => {
  const sites = await fetchSitemap('https://webuxlab.com/sitemap.xml');

  expect(sites.url).toBeDefined();
  expect(sites.sites).toBeDefined();
  expect(sites.errors).toBeDefined();
  expect(sites.domain).toBe('webuxlab.com');
  expect(sites.baseDomain).toBe('https://webuxlab.com');
});
