/* eslint-disable no-underscore-dangle */
/**
 * Format Zinc API Response
 * @param {Object} rawResponse { took: number, timed_out: boolean, hits:{ total: { value: number}, max_score: number, hits: [{_index: string, _type: '_doc', _id: string, _score: number, '@timestamp': string, _source: { description: string, title: string, url: string }}]}
 * @returns { took: number, hits: [{_index: string, _type: '_doc', _id: string, _score: number, '@timestamp': string, _source: { description: string, title: string, url: string }}], statusCode: number}
 */
function formatZincResponse(rawResponse) {
  const {
    data: {
      took,
      hits: {
        hits,
        total: { value },
      },
    },
    status,
  } = rawResponse;

  return {
    took,
    total_results: value,
    results: hits.map((hit) => ({
      timestamp: hit['@timestamp'],
      description: hit._source.description,
      title: hit._source.title,
      url: hit._source.url,
    })),
    statusCode: status,
  };
}

module.exports = {
  formatZincResponse,
};
