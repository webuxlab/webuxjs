import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  resources: [
    { path: '/', resource: path.join(__dirname, '..', 'apidoc') },
    { path: '/css', resource: path.join(__dirname, '..', 'apidoc/css') },
    { path: '/fonts', resource: path.join(__dirname, '..', 'apidoc/fonts') },
    { path: '/img', resource: path.join(__dirname, '..', 'apidoc/img') },
    {
      path: '/locales',
      resource: path.join(__dirname, '..', 'apidoc/locales'),
    },
    { path: '/utils', resource: path.join(__dirname, '..', 'apidoc/utils') },
    {
      path: '/vendor/*',
      resource: path.join(__dirname, '..', 'apidoc/vendor'),
    },
  ],
};
