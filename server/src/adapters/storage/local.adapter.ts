import fs from 'fs/promises';
import path from 'path';
import { StorageAdapter } from './types.js';

export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;

  constructor(uploadDir = './uploads') {
    this.uploadDir = path.resolve(uploadDir);
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async uploadFile(buffer: Buffer, fileName: string): Promise<string> {
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${sanitizedName}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.writeFile(filePath, buffer);
    return `local://${uniqueName}`;
  }

  async downloadFile(fileUrl: string): Promise<Buffer> {
    const fileName = fileUrl.replace('local://', '');
    const filePath = path.join(this.uploadDir, fileName);
    return fs.readFile(filePath);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.replace('local://', '');
    const filePath = path.join(this.uploadDir, fileName);
    await fs.unlink(filePath);
  }

  async getSignedUrl(fileUrl: string, _expiresIn = 3600): Promise<string> {
    return fileUrl;
  }
}