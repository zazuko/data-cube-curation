import fs from 'fs'
import { KubeConfig, BatchV1Api, V1Job, V1PodTemplateSpec } from '@kubernetes/client-node'
import { Project } from '@zazuko/rdfine-data-cube'
import { JobTrigger } from './'

const kc = new KubeConfig()
let currentNamespace = 'default'

export function triggerPipeline (project: Pick<Project, 's3Bucket' | 'id' | 'graphUri'>, trigger: JobTrigger = { s3Bucket: undefined, graphUri: undefined }) {
  const s3Bucket = trigger.s3Bucket || project.s3Bucket
  const graphUri = trigger.graphUri || project.graphUri

  if (!s3Bucket) {
    throw new Error('S3 bucket missing')
  }

  if (!graphUri) {
    throw new Error('Graph URI missing')
  }

  const requiredEnv = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'S3_ENDPOINT',
    'GRAPH_STORE_ENDPOINT',
    'GRAPH_STORE_USER',
    'GRAPH_STORE_PASSWORD',
  ]

  const podTemplate: V1PodTemplateSpec = {
    spec: {
      restartPolicy: 'Never',
      containers: [{
        name: 'datacube-cli',
        image: 'zazuko/datacube-cli:latest',
        args: [
          'transform',
          '--project', project.id.value,
          '--from', 's3',
          '-v', 's3endpoint=$(S3_ENDPOINT)',
          '-v', `s3Bucket=${s3Bucket}`,
          '--to', 'graph-store',
          '-v', 'graph-store-endpoint=$(GRAPH_STORE_ENDPOINT)',
          '-v', 'graph-store-user=$(GRAPH_STORE_USER)',
          '-v', 'graph-store-password=$(GRAPH_STORE_PASSWORD)',
          '-v', `graph=${graphUri}`,
          '--debug',
        ],
        env: requiredEnv.map(e => ({
          name: e,
          valueFrom: {
            secretKeyRef: {
              // TODO: make the runner secret name configurable
              name: 'runner-env',
              key: e,
            },
          },
        })),
      }],
    },
  }

  const job: V1Job = {
    metadata: {
      // TODO: maybe have some annotations/labels to identify jobs?
      generateName: 'datacube-runner-',
    },
    spec: {
      // Try the job 3 times before marking it as failed
      backoffLimit: 3,
      template: podTemplate,
    },
  }

  const batchApi = kc.makeApiClient(BatchV1Api)
  return batchApi.createNamespacedJob(currentNamespace, job)
    .then(j => ({
      id: j.body.metadata ? `${j.body.metadata.namespace}/${j.body.metadata.name}` : '',
      webUrl: null,
    }))
}

export function init () {
  kc.loadFromDefault()

  // TODO: make the namespace user-configurable
  const ctx = kc.getCurrentContext()
  // If this is running "in-cluster", the namespace name is stored in a file
  if (ctx === 'inClusterContext') {
    currentNamespace = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/namespace', 'utf8')
  } else {
    currentNamespace = kc.getContextObject(ctx)?.namespace || currentNamespace
  }
}
