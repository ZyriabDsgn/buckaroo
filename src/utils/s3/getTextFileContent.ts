import { GetObjectCommand } from '@aws-sdk/client-s3';
import { IncomingMessage } from 'http';
import getStream from 'get-stream';
import sanitize from 'sanitize-filename';
import normalize from 'normalize-path';
import formatPath from '../tools/formatPath.utils';
import s3Client from './s3Client';
import 'dotenv/config';

interface GetTextFileContentArgs {
  fileName: string;
  root: string;
  path: string;
  bucketName: string;
}

export default async function getTextFileContent(
  args: GetTextFileContentArgs
): Promise<[undefined, string] | [Error]> {
  try {
    let content = '';
    const fileName = sanitize(args.fileName);
    const root = normalize(args.root);
    const path = normalize(args.path);
    const fullPath = formatPath(`${root}/${path}/`, { stripTrailing: false });

    const res = await s3Client().send(
      new GetObjectCommand({
        Bucket: args.bucketName,
        Key: `${fullPath}${fileName}`,
      })
    );

    content = await getStream(res.Body as IncomingMessage);

    return [undefined, content];
  } catch (err) {
    return [err as Error];
  }
}
