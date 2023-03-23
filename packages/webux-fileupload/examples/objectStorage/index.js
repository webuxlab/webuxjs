// This is my tests and in the same time dummy examples.

/* eslint-disable no-underscore-dangle */
const { readFileSync } = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const mime = require('mime-types');

const { S3Client, GetObjectCommand, GetObjectTaggingCommand } = require('@aws-sdk/client-s3');

const FileUpload = require('../../src/index');

const _console = {
  log: console.log,
  debug: console.debug,
  verbose: console.debug,
};

(async () => {
  try {
    //   https://github.com/seaweedfs/seaweedfs/wiki/nodejs-with-Seaweed-S3
    const config = {
      s3: {
        credentials: {
          accessKeyId: 'some_access_key1',
          secretAccessKey: 'some_secret_key1',
        },
        endpoint: 'http://localhost:8333',
        forcePathStyle: true,
        region: 'us-east-1',
      },
    };
    const fileupload = new FileUpload(config, _console);
    const client = new S3Client(config.s3 || undefined);

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectcommandinput.html
    fileupload.InitObjectStorageClient();
    //   ...
    let input = {
      Bucket: 'test-locally',
      Key: 'this-is-my-file.txt',
      Body: readFileSync('./__data__/this-is-my-file.txt'),
      ContentType: mime.lookup('./__data__/this-is-my-file.txt'),
      Metadata: {
        project: 'WebuxJS',
      },
    };
    await fileupload.SaveToObjectStorage(input);

    // ...
    input = {
      Bucket: 'test-locally',
      Key: 'entete2.jpg',
      Body: readFileSync('./__data__/entete2.jpg'),
      ContentType: mime.lookup('./__data__/entete2.jpg'),
      Metadata: {
        project: 'WebuxJS',
      },
    };
    await fileupload.SaveToObjectStorage(input);

    // ...
    input = {
      Bucket: 'test-locally',
      Key: 'Production Setup · seaweedfs:seaweedfs Wiki.pdf',
      Body: readFileSync('./__data__/Production Setup · seaweedfs:seaweedfs Wiki.pdf'),
      ContentType: mime.lookup('./__data__/Production Setup · seaweedfs:seaweedfs Wiki.pdf'),
      Metadata: {
        project: 'None',
      },
      Tagging: 'author=SeaweedFS&A=B',
    };
    await fileupload.SaveToObjectStorage(input);

    const response = await client.send(
      new GetObjectCommand({ Bucket: 'test-locally', Key: 'Production Setup · seaweedfs:seaweedfs Wiki.pdf' }),
    );
    const tags = await client.send(
      new GetObjectTaggingCommand({ Bucket: 'test-locally', Key: 'Production Setup · seaweedfs:seaweedfs Wiki.pdf' }),
    );

    console.debug(response.ContentType, response.ETag, response.Metadata, tags.TagSet);
    //   OUTPUT: application/pdf "7f38808cfc681b184c4c4d0325fcb10e" { project: 'None' } [ { Key: 'A', Value: 'B' }, { Key: 'author', Value: 'SeaweedFS' } ]
  } catch (e) {
    console.error(e.message);
  }
})();
