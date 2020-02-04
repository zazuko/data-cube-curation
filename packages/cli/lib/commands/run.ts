import path from 'path'
import { DatasetCore } from 'rdf-js'
import cf from 'clownface'
import { fileToDataset } from 'barnard59'
import { Pipeline } from '../pipeline-model/Pipeline'
import { Debugger } from 'debug'
import runner = require('barnard59/lib/runner')

interface RunOptions {
  verbose: boolean;
}

export default function (pipelineId: string, basePath: string, log: Debugger) {
  return async function (sourceDir: string, targetDir: string, project: string, { verbose }: RunOptions) {
    const run = runner.create({
      basePath: path.resolve(basePath, 'pipelines'),
      outputStream: process.stdout,
      pipeline: pipelineId,
    })

    runner.log.enabled = verbose

    const pipelinePath = path.join(basePath, './pipelines/default.ttl')
    const dataset: DatasetCore = await fileToDataset('text/turtle', pipelinePath)
    const pipeline = new Pipeline(cf({ dataset }).namedNode(pipelineId))

    log('Running project %s', project)
    pipeline.addVariable('dataCubeProject', project)

    log('Target directory: %s', path.resolve(basePath, targetDir))
    pipeline.addVariable('targetDir', path.resolve(basePath, targetDir))
    log('Source directory: %s', path.resolve(basePath, sourceDir))
    pipeline.addVariable('sourceDir', path.resolve(basePath, sourceDir))

    return run(dataset)
  }
}
