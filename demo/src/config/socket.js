import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  recursionAllowed: true,
  ignoreFirstDirectory: true,
  namespaces: {
    default: [
      path.join(__dirname, '..', 'api', 'v1', '_ReservedEvents', 'connect.js'),
      path.join(__dirname, '..', 'api', 'v1', 'actions'),
    ],
  },
};
