import stream from 'readable-stream'
import Ld, { Collection, HydraResource } from 'alcaeus'
import * as DataCube from '@zazuko/rdfine-data-cube'
import * as Csvw from '@rdfine/csvw'
import { Table } from '@zazuko/rdfine-data-cube/Table'
import { parsers } from '@rdfjs/formats-common'

DataCube.wireUp(Ld.factory)

parsers.forEach((parser, type) => {
  Ld.parsers.set(type, parser)
})

async function loadProject (projectUri) {
  const resource = (await Ld.loadResource<DataCube.Project>(projectUri)).root
  if (!resource || !('tables' in resource)) {
    throw new Error(`Did not find representation of project ${projectUri}`)
  }

  return resource
}

async function loadTables (project: DataCube.Project) {
  const resource = (await Ld.loadResource<Collection<Table>>(project.tables.id.value)).root
  if (resource !== null && ('members' in resource)) {
    return resource.members
  }

  return []
}

class ProjectIterator extends stream.Readable {
  constructor (projectUri: string, log: any) {
    super({
      objectMode: true,
      read: () => {},
    })

    loadProject(projectUri)
      .then((project) => loadTables(project))
      .then(tables => {
        const loadMetadata = tables.reduce((metadata, table) => {
          log.debug(`Loading csvw ${table.csvw.id.value}`)
          const promise = Ld.loadResource(table.csvw.id.value)
            .then(r => r.root)
            .then((csvwResource: HydraResource & Csvw.Mapping | null) => {
              if (csvwResource && csvwResource.url) {
                this.push(csvwResource)
              }
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

export function loadCsvMappings (this: any, projectUri: string) {
  return new ProjectIterator(projectUri, this.log)
}
