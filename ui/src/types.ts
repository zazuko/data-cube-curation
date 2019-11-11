
export type ProjectId = string;

export interface Project {
  id: ProjectId;
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
  id: string;
  name: string;
  columns: any[];
  data: any[];
}

export interface Table {
  id: string;
  name: string;
  color: string;
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
