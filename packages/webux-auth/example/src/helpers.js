/**
 * Determines from the request header if the requester is HTMX
 * @param {Object} req Express request
 * @returns
 */
export const isHtmx = (req) => req.headers['hx-request'] === 'true';
