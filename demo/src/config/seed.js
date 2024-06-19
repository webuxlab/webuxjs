import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  directory: path.join(__dirname, '..', 'defaults'),
  enabled: process.env.RUN_SEED || true,
};
