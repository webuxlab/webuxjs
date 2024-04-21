const Webux = require('../../../../app');

function handleHome() {
  return {
    page: 'pages/home',
    data: { lang: 'en' },
  };
}

module.exports = { handleHome };
