export function domainName(url) {
  if (!url) {
    throw new Error('No url provided');
  }

  // Extract the domain only
  let domain = url.split(/https?:\/\//)[1];
  if (domain) {
    [domain] = domain.split('/');
  } else {
    [domain] = url.split('/');
  }

  // NOTE: Extract the domain and keep the HTTP(s)://
  let baseDomain = url.split(/(https?:\/\/)/)[1];
  baseDomain += domain;

  return { domain, baseDomain };
}
