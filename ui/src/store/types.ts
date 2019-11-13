import { ResourceId, Project, RemoteData, ErrorMessage, Table } from '@/types'

export interface RootState {
  errors: ErrorMessage[];
}

export interface ProjectsState {
  projects: RemoteData<Record<ResourceId, Project>>;
}
