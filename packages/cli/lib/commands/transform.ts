import { Command } from 'commander'
import path from 'path'
import { NamedNode } from 'rdf-js'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import { fileToDataset } from 'barnard59'
import { Pipeline } from '../pipeline-model/Pipeline'
import { Debugger } from 'debug'
import { AuthConfig, setupAuthentication } from '../auth'
import Runner = require('barnard59/lib/runner')
const bufferDebug = require('barnard59/lib/bufferDebug')

interface RunOptions extends Command {
  debug: boolean;
  from: string;
  to: string;
  project: string;
  variable: Map<string, string>;
  enableBufferMonitor: boolean;
  authIssuer?: string;
  authClientId: string;
  authClientSecret: string;
  authParam: Map<string, string>;
}

export default function (pipelineId: NamedNode, basePath: string, log: Debugger) {
  return async function (command: RunOptions) {
    const { from, to, project, debug, variable, enableBufferMonitor } = command

    log.enabled = debug

    if (command.authIssuer) {
      const authConfig: AuthConfig = {
        issuer: command.authIssuer,
        clientId: command.authClientId,
        clientSecret: command.authClientSecret,
        params: command.authParam,
      }

      setupAuthentication(authConfig, log)
    }

    const pipelinePath = filename => path.join(basePath, `./pipelines/${filename}.ttl`)
    const dataset = $rdf.dataset()
      .merge(await fileToDataset('text/turtle', pipelinePath('main')))
      .merge(await fileToDataset('text/turtle', pipelinePath('datacube-metadata')))
      .merge(await fileToDataset('text/turtle', pipelinePath(`from-${from}`)))
      .merge(await fileToDataset('text/turtle', pipelinePath(`to-${to}`)))

    const run = Runner.create({
      basePath: path.resolve(basePath, 'pipelines'),
      outputStream: process.stdout,
      term: pipelineId.value,
      dataset,
    })

    Runner.log.enabled = debug

    const pipeline = new Pipeline(cf({ dataset, term: pipelineId }))

    log('Running project %s', project)
    pipeline.addVariable('dataCubeProject', project)

    variable.forEach((value, key) => pipeline.addVariable(key, value))

    if (enableBufferMonitor) {
      bufferDebug(run.pipeline)
    }

    return run.promise
  }
}
