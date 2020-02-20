import { URLSearchParams } from 'url'
import fetch from 'node-fetch'
import { Project } from '@zazuko/rdfine-data-cube'
import env from '../../env'

interface GitLabJobTrigger {
  s3Bucket?: string;
  graphUri?: string;
}

export function triggerPipeline (project: Pick<Project, 's3Bucket' | 'id' | 'graphUri'>, trigger: GitLabJobTrigger = {}) {
  const s3Bucket = trigger.s3Bucket || project.s3Bucket
  const graphUri = trigger.graphUri || project.graphUri

  if (!s3Bucket) {
    throw new Error('S3 bucket missing')
  }

  if (!graphUri) {
    throw new Error('Graph URI missing')
  }

  const form = new URLSearchParams({
    token: env.GITLAB_PIPELINE_TOKEN,
    ref: env.GITLAB_PIPELINE_BRANCH || 'master',
    'variables[PROJECT]': project.id.value,
    'variables[S3_ENDPOINT]': env.AWS_S3_ENDPOINT,
    'variables[S3_BUCKET]': s3Bucket,
    'variables[AWS_ACCESS_KEY_ID]': env.AWS_ACCESS_KEY_ID,
    'variables[AWS_SECRET_ACCESS_KEY]': env.AWS_SECRET_ACCESS_KEY,
    'variables[GRAPH_STORE_ENDPOINT]': env.GRAPH_STORE_ENDPOINT,
    'variables[GRAPH_STORE_USER]': env.GRAPH_STORE_USER,
    'variables[GRAPH_STORE_PASSWORD]': env.GRAPH_STORE_PASSWORD,
    'variables[GRAPH]': graphUri,
  })

  return fetch(env.GITLAB_PIPELINE, {
    method: 'POST',
    body: form,
  })
}
