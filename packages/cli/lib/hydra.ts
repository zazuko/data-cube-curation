import * as Alcaeus from 'alcaeus'
import { parsers } from '@rdfjs/formats-common'
import * as DataCube from '@zazuko/rdfine-data-cube'

const client = Alcaeus.create({
  parsers,
})

DataCube.wireUp(client.resources.factory)

export default client
