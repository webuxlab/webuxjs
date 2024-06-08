import Sitemapper from 'sitemapper';
import { domainName } from './domain.js';

/**
 * Fetch Sitemap
 * @param {*} url sitemap url
 * @param {*} timeout Default: 15 seconds
 * @returns
 */
export async function fetchSitemap(url, timeout = 15000) {
  const sitemap = new Sitemapper({
    url,
    timeout,
  });

  const sites = await sitemap.fetch();

  return { ...sites, ...domainName(url) };
}
