export interface JobData {
  [key: string]: any;
}

export interface JobOptions {
  attempts?: number;
  backoff?: number;
  delay?: number;
}

export interface Job<T = JobData> {
  data: T;
  opts: JobOptions;
}