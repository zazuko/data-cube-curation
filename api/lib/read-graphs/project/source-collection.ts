import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { hydra, schema, rdf } from '@tpluscode/rdf-ns-builders'
import { construct } from '../../sparql'
import { api, dataCube } from '../../namespaces'

export async function getSourceCollection (sourcesCollectionId: string) {
  let dataset = await construct(CONSTRUCT`
      <${sourcesCollectionId}>
          a ${hydra.Collection} ;
          ${hydra.member} ?source ;
          ${hydra.totalItems} ?count .

      ?source
          ${schema.name} ?name ;
          ${api.sample} ?sample .`
    .WHERE`
      <${sourcesCollectionId}> ${dataCube.project} ?project .

      OPTIONAL {
          ?source a ${dataCube.Source} ;
                  ${dataCube.project} ?project ;
                  ${schema.name} ?name .

          BIND (iri(CONCAT(replace(str(?source), "/source/", "/source-sample/"))) as ?sample)
      }

      {
          SELECT (COUNT(?source) as ?count) WHERE {
              <${sourcesCollectionId}> ${dataCube.project} ?project .
              ?source ${dataCube.project} ?project; a ${dataCube.Source} .
          }
      }`)

  dataset = dataset.merge(await construct(CONSTRUCT`
      <${sourcesCollectionId}>
        ${hydra.manages} [
            ${hydra.property} ${rdf.type} ;
            ${hydra.object} ${dataCube.Source}
        ] , [
            ${hydra.subject} ?project ;
            ${hydra.property} ${dataCube.source}
        ].`
    .WHERE`<${sourcesCollectionId}> ${dataCube.project} ?project .`))

  return dataset
}
