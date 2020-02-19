import { URLSearchParams } from 'url'
import fetch from 'node-fetch'
import { Project } from '@zazuko/rdfine-data-cube'
import env from '../../env'

interface GitLabJobTrigger {
  s3Bucket?: string;
}

export function triggerPipeline (project: Pick<Project, 's3Bucket' | 'id'>, trigger: GitLabJobTrigger = {}) {
  const s3Bucket = trigger.s3Bucket || project.s3Bucket

  if (!s3Bucket) {
    throw new Error('S3 bucket missing')
  }

  const form = new URLSearchParams({
    token: env.GITLAB_PIPELINE_TOKEN,
    ref: env.GITLAB_PIPELINE_BRANCH || 'master',
    'variables[PROJECT]': project.id.value,
    'variables[S3_ENDPOINT]': env.AWS_S3_ENDPOINT,
    'variables[S3_BUCKET]': s3Bucket,
    'variables[AWS_ACCESS_KEY_ID]': env.AWS_ACCESS_KEY_ID,
    'variables[AWS_SECRET_ACCESS_KEY]': env.AWS_SECRET_ACCESS_KEY,
  })

  return fetch(env.GITLAB_PIPELINE, {
    method: 'POST',
    body: form,
  })
}
