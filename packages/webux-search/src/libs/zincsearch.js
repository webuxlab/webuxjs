import axios from 'axios';

/**
 *
 * @param {String} endpoint Zinc Search Instance
 * @param {String} authentication Basic Authentication USER:PASSWORD
 * @param {String} index Index to search in
 * @param {String} params Zinc parameters
 * @returns Promise<{data: { took: number, timed_out: boolean, hits:{ total: { value: number}, max_score: number, hits: [{_index: string, _type: '_doc', _id: string, _score: number, '@timestamp': string, _source: { description: string, title: string, url: string }}]}}>
 */
function search(endpoint, authentication, index, params) {
  return axios.post(`${endpoint}/api/${index}/_search`, params, {
    headers: {
      Authorization: `Basic ${Buffer.from(authentication).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 *
 * @param {String} searchQuery Term to search for
 * @param {String} endpoint Zinc Search Instance
 * @param {String} authentication Basic Authentication USER:PASSWORD
 * @param {String} index Index to search in
 * @param {String[]} type Zinc Search Search Type, default: matchphrase
 * @param {String[]} sort Zinc Search sort fields, default: ["-_score"]
 * @param {String[]} source Zinc Search _source, Default: ["url", "title", "description"]
 * @param {String[]} fields Zinc Search fields, Default: ["*"]
 * @param {Number} size Maximum of results
 * @param {Number} from Start At
 * @returns Promise<{ took: number, timed_out: boolean, hits:{ total: { value: number}, max_score: number, hits: [{_index: string, _type: '_doc', _id: string, _score: number, '@timestamp': string, _source: { description: string, title: string, url: string }}]}>
 */
export async function searchDocument(
  searchQuery,
  endpoint,
  authentication,
  index = '',
  type = 'matchphrase',
  sort = ['-_score'],
  source = ['url', 'title', 'description'],
  fields = ['*'],
  size = 20,
  from = 0,
) {
  const { data, status } = await search(endpoint, authentication, index, {
    search_type: type,
    query: {
      term: searchQuery,
    },
    sort_fields: sort,
    from,
    max_results: size,
    fields,
    _source: source,
  });

  return { data, status };
}
