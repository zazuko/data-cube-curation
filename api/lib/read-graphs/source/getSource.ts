import $rdf from 'rdf-ext'
import { DESCRIBE } from '@tpluscode/sparql-builder'
import { namedNode } from '@rdfjs/data-model'
import { construct } from '../../sparql'
import { api } from '../../namespaces'

export async function getSource (sourceId: string) {
  const source = namedNode(sourceId)
  const dataset = await construct(DESCRIBE`${source}`)

  dataset.add($rdf.quad(
    source,
    api.sample,
    $rdf.namedNode(sourceId.replace('/source/', '/source-sample/'))
  ))

  return dataset
}
