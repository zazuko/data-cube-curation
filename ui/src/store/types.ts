import { ProjectId, Project, RemoteData } from '../types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface ProjectsState {
  projects: RemoteData<Record<ProjectId, Project>>
}
