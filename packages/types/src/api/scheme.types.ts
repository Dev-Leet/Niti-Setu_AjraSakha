import { Scheme, CreateSchemeInput, UpdateSchemeInput } from '../domain/scheme.types.js';
import { SavedScheme, SaveSchemeInput } from '../domain/saved-scheme.types.js';

export interface SchemeQuery {
  state?: string;
  ministry?: string;
  category?: string;
  status?: string;
}

export interface SchemesResponse {
  schemes: Scheme[];
  total?: number;
} 

export interface SchemeResponse {
  scheme: Scheme;
}

export type CreateSchemeRequest = CreateSchemeInput;

export type UpdateSchemeRequest = UpdateSchemeInput;

export type SaveSchemeRequest = SaveSchemeInput;

export interface SavedSchemesResponse {
  schemes: SavedScheme[];
  total: number;
}