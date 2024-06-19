import 'dotenv/config';
import { searchDocument, formatZincResponse } from '../src/index.js';

test.skip('search document', async () => {
  const {
    data: { took, timed_out, hits },
  } = await searchDocument('webuxlab', process.env.ZINC_ENDPOINT, process.env.ZINC_AUTHENTICATION, 'webuxlab.com');

  expect(took).toBeDefined();
  expect(timed_out).toBeFalsy();
  expect(hits).toBeDefined();
  expect(hits.total.value).toBeDefined();
  expect(hits.max_score).toBeDefined();
  expect(hits.hits).toBeDefined();
});

test('Format Zinc Response', async () => {
  const response = {
    data: {
      took: 2,
      timed_out: false,
      hits: {
        total: { value: 940 },
        max_score: 1.0015254813725476,
        hits: [
          {
            _index: 'webuxlab.com',
            _type: '_doc',
            _id: '1SLIapiLkaY',
            _score: 1.0015254813725476,
            '@timestamp': '2022-10-14T00:38:07.673494528Z',
            _source: {
              description: 'Quelques dessins faits avec asprite',
              title: 'Pixel Arts | Webux Lab',
              url: 'https://webuxlab.com/fr/projects/pixel-arts',
            },
          },
          {
            _index: 'webuxlab.com',
            _type: '_doc',
            _id: '1SXy00vpXgc',
            _score: 1.0015201408837215,
            '@timestamp': '2022-10-21T03:47:06.704562432Z',
            _source: {
              description: 'Quelques drawings fait avec asprite',
              title: 'Pixel Arts | Webux Lab',
              url: 'https://webuxlab.com/en/projects/pixel-arts',
            },
          },
        ],
      },
    },
    status: 200,
  };

  const { took, total_results, results, statusCode } = formatZincResponse(response);

  expect(took).toBe(2);
  expect(total_results).toBe(940);
  expect(results).toHaveLength(2);
  expect(statusCode).toBe(200);
});
