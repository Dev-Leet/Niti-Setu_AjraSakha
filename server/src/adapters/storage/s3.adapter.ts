import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET } from '@config/aws.js';
import { helpers } from '@utils/helpers.js';
import type { StorageAdapter } from './types.js';

export const s3Adapter: StorageAdapter = {
  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    const key = `pdfs/${helpers.generateId()}-${helpers.sanitizeFilename(filename)}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'application/pdf',
      })
    );

    return `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
  },

  async downloadFile(url: string): Promise<Buffer> {
    const key = url.split('.com/')[1];

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      })
    );

    return Buffer.from(await response.Body!.transformToByteArray());
  },

  async deleteFile(url: string): Promise<void> {
    const key = url.split('.com/')[1];

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      })
    );
  },
};