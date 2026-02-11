export interface StorageAdapter {
  uploadFile(buffer: Buffer, filename: string): Promise<string>;
  downloadFile(url: string): Promise<Buffer>;
  deleteFile(url: string): Promise<void>;
}