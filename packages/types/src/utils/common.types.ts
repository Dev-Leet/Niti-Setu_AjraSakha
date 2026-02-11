export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Timestamp = Date | string | number;

export type ID = string;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;