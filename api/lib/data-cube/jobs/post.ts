import asyncMiddleware from 'middleware-async'
import { Request, Response } from 'express'
import runner, { JobTrigger } from '../../services/runner'
import { getProject } from '../../read-graphs/project'
import { RdfResourceImpl, property, namespace } from '@tpluscode/rdfine'
import { api, dataCube } from '../../namespaces'
import { getProjectId } from '../../read-graphs/project/links'
import * as log from '../../log'

@namespace(api)
class TriggerCommand extends RdfResourceImpl implements JobTrigger {
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

  const jobRun = await runner.triggerPipeline(project, overrides)
  log.log(`Job ID: ${jobRun.id}`)
  if (jobRun.webUrl) {
    res.setHeader('Location', jobRun.webUrl)
  }

  next()
})
