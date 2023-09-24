module.exports = {
  // HTML Elements
  elements: ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'span', 'img', 'a', 'footer', 'header', 'td'],

  // Meta Names
  metas: ['title', 'description', 'viewport', 'author', 'keywords'],

  // File Types
  fileTypes: {
    image: ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
    video: [
      'video/3gpp',
      'video/3gpp2',
      'video/3gp2',
      'video/mpeg',
      'video/mp4',
      'video/ogg',
      'video/quicktime',
      'video/webm',
      'application/mpegurl',
      'application/x-mpegurl',
    ],
    audio: [
      'audio/3gpp',
      'audio/3gpp2',
      'audio/3gp2',
      'audio/aac',
      'audio/mpeg',
      'audio/flac',
      'audio/x-flac',
      'audio/mpeg',
      'audio/mp4',
      'audio/ogg',
      'audio/wave',
      'audio/wav',
      'audio/x-wav',
      'audio/x-pn-wav',
      'audio/webm',
      'audio/mpegurl',
      'audio/x-mpegurl',
    ],
  },

  // Extensions
  extensions: {
    image: ['.webp', '.svg', '.png', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.gif', '.avif', '.apng'],
    video: [
      '.webm',
      '.3gp',
      '.mpg',
      '.mpeg',
      '.mp4',
      '.m4v',
      '.m4p',
      '.ogv',
      '.ogg',
      '.mov',
      '.avi',
      '.mkv',
      '.m3u8',
      '.wmv',
      '.flv',
      '.ts',
      '.yuv',
    ],
    audio: ['.webm', '.wav', '.oga', '.ogg', '.mp4', '.m4a', '.mp3', '.mpg', '.mpeg', '.flac', '.aac', '.3gp', '.m3u'],
    font: ['.woff2'],
  },
};
