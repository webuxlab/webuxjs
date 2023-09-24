const { searchDocument } = require('./libs/zincsearch');
const { formatZincResponse } = require('./utils/format');

module.exports = {
  searchDocument,
  formatZincResponse,
};
