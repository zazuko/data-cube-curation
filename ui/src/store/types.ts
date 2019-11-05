import { ProjectId, Project, RemoteData, ErrorMessage } from '../types'
import { IOperation } from 'alcaeus/types/Resources'

export interface RootState {
  errors: ErrorMessage[];
}

export interface ProjectsState {
  projects: RemoteData<Record<ProjectId, Project>>;
  createOperation: IOperation | null
}
