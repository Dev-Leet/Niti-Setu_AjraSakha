import { StorageAdapter } from './types.js';
import { LocalStorageAdapter } from './local.adapter.js';
import { S3Adapter } from './s3.adapter.js';
import { env } from '@config/env.js';

export function getStorageAdapter(): StorageAdapter {
  const storageType = env.STORAGE_TYPE || 'local';
  
  if (storageType === 's3') {
    return new S3Adapter();
  }
  
  const uploadDir = env.LOCAL_UPLOAD_DIR || './uploads';
  return new LocalStorageAdapter(uploadDir);
}

export * from './types.js';