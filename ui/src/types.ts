
export type ResourceId = string;

export interface Project {
  id: ResourceId;
  name: string | null;
  sources: Source[];
  tables: Table[];
}

export interface RemoteData<T> {
  isLoading: boolean;
  data: T | null;
  error: string | null;
}

export interface Source {
  id: ResourceId;
  name: string;
  columns: any[];
  data: any[];
}

export interface Table {
  type: 'fact' | 'dimension';
  id: ResourceId;
  name: string;
  color: string;
  sourceId: ResourceId;
  identifierTemplate: string | null;
  properties: Property[];
}

export interface Property {
  name: string;
  type: string | null;
}

export interface ErrorMessage {
  title: string;
  message: string;
}
