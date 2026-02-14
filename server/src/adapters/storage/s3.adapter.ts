import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageAdapter } from './types.js';
import { env } from '@config/env.js';

export class S3Adapter implements StorageAdapter {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    if (!env.AWS_REGION || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET) {
      throw new Error('AWS credentials not configured');
    }

    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = env.AWS_S3_BUCKET;
  }

  async uploadFile(buffer: Buffer, fileName: string): Promise<string> {
    const key = `uploads/${Date.now()}_${fileName}`;
    
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
      })
    );

    return `s3://${this.bucketName}/${key}`;
  }

  async downloadFile(fileUrl: string): Promise<Buffer> {
    const key = fileUrl.replace(`s3://${this.bucketName}/`, '');
    
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );

    return Buffer.from(await response.Body!.transformToByteArray());
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = fileUrl.replace(`s3://${this.bucketName}/`, '');
    
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
  }

  async getSignedUrl(fileUrl: string, expiresIn = 3600): Promise<string> {
    const key = fileUrl.replace(`s3://${this.bucketName}/`, '');
    
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}