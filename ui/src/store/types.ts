import { ProjectId, Project, RemoteData } from '../types'
import { IOperation } from 'alcaeus/types/Resources'

export interface RootState {}

export interface ProjectsState {
  projects: RemoteData<Record<ProjectId, Project>>;
  createOperation: IOperation | null
}
