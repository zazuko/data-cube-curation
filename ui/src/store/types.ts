import { ProjectId, Project, RemoteData, ErrorMessage } from '../types'

export interface RootState {
  errors: ErrorMessage[];
}

export interface ProjectsState {
  projects: RemoteData<Record<ProjectId, Project>>;
}
