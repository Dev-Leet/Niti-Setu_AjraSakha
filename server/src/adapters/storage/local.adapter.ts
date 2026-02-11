import fs from 'fs/promises';
import path from 'path';
import { helpers } from '@utils/helpers.js';
import type { StorageAdapter } from './types.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const localAdapter: StorageAdapter = {
  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const sanitized = helpers.sanitizeFilename(filename);
    const filepath = path.join(UPLOAD_DIR, `${helpers.generateId()}-${sanitized}`);
    await fs.writeFile(filepath, buffer);
    return filepath;
  },

  async downloadFile(filepath: string): Promise<Buffer> {
    return fs.readFile(filepath);
  },

  async deleteFile(filepath: string): Promise<void> {
    await fs.unlink(filepath);
  },
};