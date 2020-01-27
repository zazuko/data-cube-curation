import path from 'path'
import { DatasetCore } from 'rdf-js'
import cf from 'clownface'
import { fileToDataset } from 'barnard59'
import { Pipeline } from '../pipeline-model/Pipeline'
import runner = require('barnard59/lib/runner')

interface RunOptions {
  project: string;
  verbose: boolean;
  sourceDir: string;
}

export default function (pipelineId: string, basePath: string) {
  return async function (sourceDir: string, { project, verbose }: RunOptions) {
    const run = runner.create({
      basePath: path.resolve(basePath, 'pipelines'),
      outputStream: process.stdout,
      pipeline: pipelineId,
    })

    runner.log.enabled = verbose

    const pipelinePath = path.join(basePath, './pipelines/default.ttl')
    const dataset: DatasetCore = await fileToDataset('text/turtle', pipelinePath)
    const pipeline = new Pipeline(cf({ dataset }).namedNode(pipelineId))

    pipeline.addVariable('dataCubeProject', project)
    pipeline.addVariable('targetDir', path.join(basePath, 'output'))
    pipeline.addVariable('sourceDir', path.join(basePath, sourceDir))

    return run(dataset)
  }
}
