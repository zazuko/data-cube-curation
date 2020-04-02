import asyncMiddleware from 'middleware-async'
import { Request, Response } from 'express'
import { GitLabJobTrigger, triggerPipeline } from '../../services/gitLab/trigger'
import { getProject } from '../../read-graphs/project'
import RdfResourceImpl, { property, namespace } from '@tpluscode/rdfine'
import { api, dataCube } from '../../namespaces'
import { getProjectId } from '../../read-graphs/project/links'
import * as log from '../../log'

@namespace(api)
class TriggerCommand extends RdfResourceImpl implements GitLabJobTrigger {
  @property.literal()
  s3Bucket: string;

  @property({ path: dataCube.graphUri })
  graphUri: string;
}

export const handler = asyncMiddleware(async (req: Request, res: Response, next) => {
  const projectId = await getProjectId(req.resourceId)
  if (!projectId) {
    res.status(404)
    next()
    return
  }

  const project = await getProject(projectId)
  const overrides = req.buildModel(TriggerCommand)[0]

  const gitLabResponse = await triggerPipeline(project, overrides)
  const gitLabJob = await gitLabResponse.json()

  if (gitLabResponse.ok) {
    // todo: create a local job resource
    res.setHeader('Location', gitLabJob.web_url)
    next()
  } else {
    log.error(`GitLab responded ${gitLabResponse.statusText}; error: ${gitLabJob.error}`)
    throw new Error(`Failed to start transformation job: ${gitLabResponse.statusText}`)
  }
})
