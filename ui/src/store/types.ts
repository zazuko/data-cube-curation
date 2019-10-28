import { ProjectId, Project, RemoteData } from '../types';

// tslint:disable-next-line: no-empty-interface
export interface RootState {}

export interface ProjectsState {
  projects: RemoteData<Record<ProjectId, Project>>;
}
