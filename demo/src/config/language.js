import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  availables: ['fr', 'en'],
  directory: path.join(__dirname, '..', 'locales'),
  default: 'en',
  autoReload: true,
  syncFiles: true,
};
