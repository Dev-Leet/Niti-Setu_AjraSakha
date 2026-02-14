export interface StorageAdapter {
  uploadFile(buffer: Buffer, fileName: string): Promise<string>;
  downloadFile(fileUrl: string): Promise<Buffer>;
  deleteFile(fileUrl: string): Promise<void>;
  getSignedUrl(fileUrl: string, expiresIn?: number): Promise<string>;
}