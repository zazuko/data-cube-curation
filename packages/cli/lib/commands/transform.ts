import { Command } from 'commander'
import path from 'path'
import { NamedNode } from 'rdf-js'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import { fileToDataset } from 'barnard59'
import { Pipeline } from '../pipeline-model/Pipeline'
import { Debugger } from 'debug'
import runner = require('barnard59/lib/runner')

interface RunOptions extends Command {
  debug: boolean;
  from: string;
  to: string;
  project: string;
  variable: Map<string, string>;
}

export default function (pipelineId: NamedNode, basePath: string, log: Debugger) {
  return async function (command: RunOptions) {
    const { from, to, project, debug, variable } = command

    const run = runner.create({
      basePath: path.resolve(basePath, 'pipelines'),
      outputStream: process.stdout,
      pipeline: pipelineId.value,
    })

    runner.log.enabled = debug
    log.enabled = debug

    const pipelinePath = filename => path.join(basePath, `./pipelines/${filename}.ttl`)
    const dataset = $rdf.dataset()
      .merge(await fileToDataset('text/turtle', pipelinePath('main')))
      .merge(await fileToDataset('text/turtle', pipelinePath(`from-${from}`)))
      .merge(await fileToDataset('text/turtle', pipelinePath(`to-${to}`)))

    const pipeline = new Pipeline(cf({ dataset, term: pipelineId }))

    log('Running project %s', project)
    pipeline.addVariable('dataCubeProject', project)

    variable.forEach((value, key) => pipeline.addVariable(key, value))

    return run(dataset)
  }
}
