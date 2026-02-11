export type AsyncResult<T, E = Error> = Promise<{ data: T; error: null } | { data: null; error: E }>;

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export type AsyncOperation<T> = () => Promise<T>;

export type AsyncCallback<T> = (data: T) => void | Promise<void>;