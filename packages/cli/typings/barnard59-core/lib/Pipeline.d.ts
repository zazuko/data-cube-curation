declare module 'barnard59-core/lib/Pipeline' {

  import Logger from 'barnard59-core/lib/logger'

  namespace Pipeline {
    interface Context {
      log: Logger;
    }
  }

  class Pipeline {
    context: Pipeline.Context
  }

  export = Pipeline
}
