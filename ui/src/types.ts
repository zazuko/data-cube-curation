
import { Collection } from 'alcaeus/types/Resources'

export type ResourceId = string;

export interface Project {
  id: ResourceId;
  actions: Record<string, any>;
  name: string | null;
}

export interface ProjectFormData {
  id?: string;
  name: string;
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

export interface TableFormData {
  id?: ResourceId,
  type: TableType,
  name: string,
  color: string,
  identifierTemplate: string,
  sourceId: ResourceId,
}

export interface Attribute {
  id: ResourceId;
  name: string;
  predicateId: ResourceId;
  columnId: ResourceId;
  dataTypeId: ResourceId | null;
  language: string | null;
  tableId: ResourceId;
}

export interface AttributeFormData {
  id?: ResourceId,
  name: string,
  columnId: ResourceId,
  predicateId: ResourceId,
  dataTypeId: string,
  language: string
}

export interface ErrorMessage {
  title: string;
  message: string;
}
