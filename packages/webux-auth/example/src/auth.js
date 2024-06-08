import WebuxAuth from '../../../webux-auth/src/index.js';
import config from './config.js';

export default new WebuxAuth(config, console); // FIXME: There is coupling :cry:
