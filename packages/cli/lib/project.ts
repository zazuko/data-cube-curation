import stream from 'readable-stream'
import Ld, { Collection, HydraResource } from 'alcaeus'
import * as DataCube from '@zazuko/rdfine-data-cube'
import * as Csvw from '@rdfine/csvw'
import { Table } from '@zazuko/rdfine-data-cube/Table'
import { parsers } from '@rdfjs/formats-common'
import Logger from 'barnard59-core/lib/logger'
import { Context } from 'barnard59-core/lib/Pipeline'

DataCube.wireUp(Ld.factory)

parsers.forEach((parser, type) => {
  Ld.parsers.set(type, parser)
})

async function loadProject (projectUri, log) {
  log.debug(`Loading project ${projectUri}`)
  const resource = (await Ld.loadResource<DataCube.Project>(projectUri)).root
  if (!resource || !('tables' in resource)) {
    throw new Error(`Did not find representation of project ${projectUri}`)
  }

  return resource
}

async function loadTables (project: DataCube.Project, log): Promise<Table[]> {
  const tablesId = project.tables.id.value
  log.info(`Will transform project ${project.name}`)
  log.debug(`Loading output tables ${tablesId}`)
  const resource = (await Ld.loadResource<Collection<Table>>(tablesId)).root
  if (resource !== null && ('members' in resource)) {
    return resource.members
  }

  return []
}

class ProjectIterator extends stream.Readable {
  constructor (projectUri: string, log: Logger) {
    super({
      objectMode: true,
      read: () => {},
    })

    loadProject(projectUri, log)
      .then(project => loadTables(project, log))
      .then(tables => {
        const loadMetadata = tables.reduce((metadata, table) => {
          log.debug(`Loading csvw for table ${table.name}`)
          const promise = Ld.loadResource(table.csvw.id.value)
            .then(r => r.root)
            .then((csvwResource: HydraResource & Csvw.Mapping | null) => {
              if (!csvwResource) {
                log.warn(`Skipping table ${table.name}. Failed to dereference`)
                return
              }

              if (!csvwResource.url) {
                log.warn(`Skipping table ${table.name}. Missing csvw:url property`)
                return
              }

              if (!csvwResource.dialect.isSet) {
                log.warn(`Skipping table ${table.name}. CSV dialect not set`)
                return
              }

              log.debug(`Will transform table ${table.name} from ${csvwResource.url}. Dialect: delimiter=${csvwResource.dialect.delimiter} quote=${csvwResource.dialect.quote}`)

              this.push(csvwResource)
            })
            .catch(e => {
              log.error(`Failed to load ${table.csvw.id.value}`)
              log.error(e.message)
            })

          metadata.push(promise)

          return metadata
        }, [] as Promise<void>[])

        return Promise.all(loadMetadata)
      })
      .finally(() => {
        this.push(null)
      })
  }
}

export function loadCsvMappings (this: Context, projectUri: string) {
  return new ProjectIterator(projectUri, this.log)
}
