/**
 * File: default.js
 * Author: Tommy Gingras
 * Date: 2020-05-02
 * License: All rights reserved Studio Webux 2015-Present
 */

// The default tokens used with the request interceptor
// it can be modified using the 'tokens' options.
module.exports = [
  {
    name: 'body',
    needStringify: true,
  },
  {
    name: 'params',
    needStringify: true,
  },
  {
    name: 'query',
    needStringify: true,
  },
  {
    name: 'headers',
    needStringify: true,
  },
  {
    name: 'type',
    needStringify: false,
    value: 'content-type',
    parent: 'headers',
  },
  {
    name: 'language',
    needStringify: false,
    value: 'accept-language',
    parent: 'headers',
  },
];
