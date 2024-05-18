const Webux = require('../../../../app');

// curl localhost:1337/home
function handleHome() {
  return {
    page: 'pages/home',
    data: { lang: 'en' },
  };
}

module.exports = { handleHome };
