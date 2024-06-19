/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2023-03-22
 * License: All rights reserved Studio Webux 2015-Present
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export function initObjectStorageClient(config, log) {
  log.verbose(config);
  return new S3Client(config.s3 || undefined);
}

export async function saveToObjectStorage(client, input, log) {
  if (!client) throw new Error('No Client provided');
  log.verbose(input);

  const response = await client.send(new PutObjectCommand(input));
  log.debug(response);

  return response;
}
