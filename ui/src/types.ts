
import { Collection } from 'alcaeus/types/Resources'

export type ResourceId = string;

export interface Project {
  id: ResourceId;
  actions: Record<string, any>;
  name: string | null;
}

export interface RemoteData<T> {
  isLoading: boolean;
  data: T | null;
  error: string | null;
}

export interface Source {
  id: ResourceId;
  name: string;
  columns: Column[];
}

export interface Column {
  id: ResourceId;
  name: string;
  actions: Record<string, any>;
}

export type TableType = 'fact' | 'dimension'

export interface Table {
  type: TableType;
  id: ResourceId;
  name: string;
  color: string;
  sourceId: ResourceId;
  identifierTemplate: string | null;
  attributesCollection: Collection | null;
  actions: Record<string, any>;
}

export interface Attribute {
  id: ResourceId,
  name: string,
  predicateId: ResourceId,
  columnId: ResourceId,
  type: ResourceId | null,
  language: ResourceId | null,
}

export interface ErrorMessage {
  title: string;
  message: string;
}
