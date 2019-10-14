import { ProjectId, Project, RemoteData } from '../types';


export interface RootState {}

export interface ProjectsState {
    projects: RemoteData<Record<ProjectId, Project>>;
}
