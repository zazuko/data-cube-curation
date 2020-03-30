import * as kubernetes from './kubernetes'
import * as gitLab from './gitLab'
import { Project } from '@zazuko/rdfine-data-cube'
import env from '../../env'

export interface JobTrigger {
  s3Bucket: string | undefined;
  graphUri: string | undefined;
}

export interface JobRun {
  id: string;
  webUrl: string | null;
}

export interface Runner {
  triggerPipeline (project: Pick<Project, 's3Bucket' | 'id' | 'graphUri'>, trigger: JobTrigger): Promise<JobRun>;
}

let runner: Runner

if (env.has.JOB_RUNNER && env.JOB_RUNNER === 'kubernetes') {
  kubernetes.init()
  runner = kubernetes
} else {
  runner = gitLab
}

export default runner
