const fs = require('fs');
const path = require('path');

const readCache = (file) => {
  try {
    const cache = fs.readFileSync(path.join(__dirname, file));
    console.log(`read cache from : ${path.join(__dirname, file)}`);
    return JSON.parse(cache);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return {};
    }
    console.error(`\x1b[31mAn error has occured while reading the cache. Using default values.\x1b[0m`);
    return null;
  }
};

const createCache = (cache, file) => {
  fs.writeFile(path.join(__dirname, file), JSON.stringify(cache), (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`\x1b[32mCache Saved !\x1b[0m`);
  });
};

module.exports = {
  readCache,
  createCache,
};
