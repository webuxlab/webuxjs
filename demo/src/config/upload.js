import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  destination: path.join(__dirname, '../uploads'),
  tmp: path.join(__dirname, '../.tmp'),
  limits: {
    fileSize: '1024*1024*10',
  },
  abortOnLimit: true,
  safeFileNames: true,
  size: 400,
  mimeTypes: ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'],
  filetype: 'image', // or document
  key: 'picture',
};
