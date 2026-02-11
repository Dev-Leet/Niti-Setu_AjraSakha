export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required?: boolean;
  default?: any;
  validate?: (value: any) => boolean;
  transform?: (value: any) => any;
}

export interface Schema {
  [field: string]: SchemaField;
}