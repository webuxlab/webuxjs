/**
 * Determines from the request header if the requester is HTMX
 * @param {Object} req Express request
 * @returns
 */
const isHtmx = (req) => req.headers['hx-request'] === 'true';

module.exports = { isHtmx };
