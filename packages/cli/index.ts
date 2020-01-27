import program from 'commander'
import debug from 'debug'
import namespace from '@rdfjs/namespace'
import run from './lib/commands/run'

const log = debug('data-cube')
log.enabled = true

const ns = {
  pipeline: namespace('urn:pipeline:data-cube-curation'),
}

const pipelines = {
  TransformFiles: ns.pipeline('#TransformFiles'),
}

async function main () {
  program
    .command('run <sourceDir>')
    .option('--project <projectUri>', 'Data cube curation project URL')
    .option('--verbose')
    .action(run(pipelines.TransformFiles.value, __dirname))

  return program.parseAsync(process.argv)
}

main()
  .then(() => {
    log('Done!')
  })
  .catch(e => {
    log(e)
    process.exit(1)
  })
