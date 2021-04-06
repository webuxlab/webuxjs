/**
 * File: constants.js
 * Author: Tommy Gingras
 * Date: 2020-05-06
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const messages = {};

// List of default messages
messages.MSG_FORBIDDEN = 'You are not authorized to access this resource.';
messages.DEVMSG_FORBIDDEN = 'An authentication is required.';
messages.MSG_BADREQUEST = 'The request is malformed, please refer to the documentation.';
messages.MSG_SERVERERROR = 'An internal error occured, please try again later.';
messages.MSG_NOTFOUND = 'The resource is not available.';
messages.DEVMSG_NOTFOUND = 'Resource not found';
messages.MSG_UNPROCESSABLE = 'The resource is not compliant with the API.';
messages.DEVMSG_UNPROCESSABLE = 'Resource unprocessable';
messages.MSG_UNAUTHORIZED = 'You are not authorized to access this resource, please contact an administrator to get the proper rights.';
messages.DEVMSG_UNAUTHORIZED = "the user is logged in but he doesn't have the permission to do an action";

module.exports = messages;
