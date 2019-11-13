
export type ResourceId = string;

export interface Project {
  id: ResourceId;
  actions: Record<string, any>,
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
  columns: any[];
}

export type TableType = 'fact' | 'dimension'

export interface Table {
  type: TableType;
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
