
import { Collection, HydraResource } from 'alcaeus/types/Resources'

export type ResourceId = string;

export interface Project extends HydraResource {
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

export interface Source extends HydraResource {
  id: ResourceId;
  name: string;
  columns: Column[];
  projectId: ResourceId;
  actions: Record<string, any>;
}

export interface Column extends HydraResource {
  id: ResourceId;
  name: string;
  actions: Record<string, any>;
}

export type TableType = 'fact' | 'dimension'

export interface Table extends HydraResource {
  type: TableType;
  id: ResourceId;
  name: string;
  color: string;
  sourceId: ResourceId;
  identifierTemplate: string | null;
  attributesCollection: Collection | null;
  mapping: any;
  preview: any;
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

export interface Attribute extends HydraResource {
  id: ResourceId;
  predicateId: ResourceId;
  columnId: ResourceId;
  dataTypeId: ResourceId | null;
  language: string | null;
  tableId: ResourceId;
  actions: Record<string, any>;
}

export interface AttributeFormData {
  id?: ResourceId,
  columnId: ResourceId,
  predicateId: ResourceId,
  dataTypeId: string,
  language: string
}

export interface ErrorMessage {
  title: string;
  message: string;
}
