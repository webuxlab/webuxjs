// Studio Webux S.E.N.C @ 2021

// https://gist.github.com/marcelo-ribeiro/abd651b889e4a20e0bab558a05d38d77
function slugify(str) {
  const map = {
    a: 'á|à|ã|â|À|Á|Ã|Â',
    e: 'é|è|ê|É|È|Ê',
    i: 'í|ì|î|Í|Ì|Î',
    o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    c: 'ç|Ç',
    n: 'ñ|Ñ',
  };

  // eslint-disable-next-line guard-for-in
  for (const pattern in map) {
    // eslint-disable-next-line no-param-reassign
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  }

  return str;
}

/**
 *  Sanitize a string
 * @param {String} str String to process
 */
function sanitizeString(str) {
  return slugify(str)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/_*$/g, '');
}

/**
 *  Sanitize the image key
 * @param {String} imgKey Image Key to process
 */
function sanitizeImg(imgKey) {
  return imgKey.split('?')[0].split('').reverse().join('').split('/')[0].split('').reverse().join('');
}

module.exports = {
  sanitizeString,
  sanitizeImg,
};
