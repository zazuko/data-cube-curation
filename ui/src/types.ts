
export type ProjectId = string;

export interface Project {
  id: ProjectId
  name: string | null
  sources: Source[]
  tables: Table[]
  rules: Rule[]
}

export interface RemoteData<T> {
  isLoading: boolean
  data?: T
  error?: string
}

export interface Source {
  id: string
  name: string
  columns: any[]
  data: any[]
}

export interface Table {
  id: string
  name: string
  color: string
  properties: Property[]
}

export interface Property {
  name: string
  type: string | null
}

export interface Rule {
  id: string
  table: string
  property: string
  columns: string[]
  transform: string
}
