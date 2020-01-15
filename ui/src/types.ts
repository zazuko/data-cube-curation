
import { Collection, HydraResource, IOperation } from 'alcaeus/types/Resources'

export type ResourceId = string;

export type Actions = Record<string, IOperation | null>;

export interface Project extends HydraResource {
  id: ResourceId;
  actions: Actions;
  name: string;
  baseUri: string;
  tablesCollection: Collection | null;
  sourcesCollection: Collection | null;
}

export interface ProjectFormData {
  id?: string;
  name: string;
  baseUri: string;
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
  actions: Actions;
  sampleCollection: Collection | null;
}

export interface Column extends HydraResource {
  id: ResourceId;
  name: string;
  actions: Actions;
}

export type TableType = 'fact' | 'dimension'

export interface Table extends HydraResource {
  type: TableType;
  id: ResourceId;
  name: string;
  color: string;
  sourceId: ResourceId;
  identifierTemplate: string | null;
  identifierColumns: Column[];
  attributesCollection: Collection | null;
  mapping: any;
  preview: any;
  actions: Actions;
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
  tableId: ResourceId;
  actions: Actions;
}

export interface ValueAttribute extends Attribute {
  columnId: ResourceId;
  dataTypeId: ResourceId | null;
  language: string | null;
  tableId: ResourceId;
  actions: Actions;
}

export interface ReferenceAttribute extends Attribute {
  referencedTableId: ResourceId;
  columnMapping: ReferenceColumnMapping[];
}

export interface ReferenceColumnMapping {
  sourceColumnId: ResourceId,
  referencedColumnId: ResourceId
}

export interface ValueAttributeFormData {
  id?: ResourceId,
  columnId: ResourceId,
  predicateId: ResourceId,
  dataTypeId: string,
  language: string
}

export interface ReferenceAttributeFormData {
  id?: ResourceId,
  referencedTableId: ResourceId,
  predicateId: ResourceId,
  columnMapping: ReferenceColumnMapping[]
}

export interface ErrorMessage {
  title: string;
  message: string;
}

export type SourceColumnFilter = 'all' | 'mapped' | 'not-mapped'
