declare module 'barnard59/lib/runner' {
  import { DatasetCore } from 'rdf-js'
  import { Writable } from 'stream'
  import { Debugger } from 'debug'

  type Runner = {
    (dataset: DatasetCore): Promise<any>;
  }

  interface RunnerInit {
    basePath: string;
    outputStream: Writable;
    pipeline: string;
    variable?: Map<string, string>;
  }

  function create(options: RunnerInit): Runner

  const log: Debugger

  export {
    create,
    log,
  }
}
