import Serializer from '@rdfjs/serializer-jsonld'
import { canonize } from 'jsonld'

const serializer = new Serializer()

export async function canonized (dataset: any) {
  // const writer = new Writer({ end: false })

  const output = serializer.import(dataset.toStream())

  const jsonld = await new Promise(resolve => {
    output.on('data', resolve)
  })

  return canonize(jsonld)
}
