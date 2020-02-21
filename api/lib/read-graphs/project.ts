import cf from 'clownface'
import $rdf from 'rdf-ext'
import { Project } from '@zazuko/rdfine-data-cube'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import { ProjectMixin } from '@zazuko/rdfine-data-cube/Project'
import { schema, hydra, rdf } from '@tpluscode/rdf-ns-builders'
import { ASK, CONSTRUCT, DELETE, INSERT } from '@tpluscode/sparql-builder'
import ProjectEvents from '../domain/project/events'
import { execute } from '../sparql'
import { api, dataCube } from '../namespaces'
import TableEvents from '../domain/table/events'
import { projects } from '../storage/repository'
import { unselectFactTable } from '../domain/project'
import { namedNode } from '@rdfjs/data-model'

ProjectEvents.on.ProjectCreated(async ev => {
  const query = INSERT.DATA`
    <${ev.id}> a ${dataCube.Project}; ${schema.name} ${ev.data.name} ;
       ${api.s3Bucket} ${ev.data.s3Bucket} ;
       ${dataCube.baseUri} ${ev.data.baseUri} .
    <${ev.id}/tables> ${dataCube.project} <${ev.id}> .
    <${ev.id}/jobs> ${dataCube.project} <${ev.id}> .
    <${ev.id}/sources> ${dataCube.project} <${ev.id}> .
    <${ev.id}/fact-table> ${dataCube.project} <${ev.id}> .
    <${ev.id}>
        ${api.tables} <${ev.id}/tables> ;
        ${api.jobs} <${ev.id}/jobs> ;
        ${api.sources} <${ev.id}/sources> ;
        ${api.factTable} <${ev.id}/fact-table> .
  `

  await execute(query)
})

ProjectEvents.on.ProjectRenamed(async ev => {
  const query = DELETE`<${ev.id}> ${schema.name} ?currentName .`
    .INSERT`<${ev.id}> ${schema.name} ${ev.data.name} .`

  await execute(query)
})

ProjectEvents.on.S3BucketChanged(async ev => {
  const query = DELETE`<${ev.id}> ${api.s3Bucket} ?current .`
    .INSERT`<${ev.id}> ${api.s3Bucket} "${ev.data.s3Bucket}" .`
    .WHERE`OPTIONAL {
        <${ev.id}> ${api.s3Bucket} ?current .
      }`

  await execute(query)
})

ProjectEvents.on.ProjectRebased(async ev => {
  const query = DELETE`<${ev.id}> ${dataCube.baseUri} ?currentBase .`
    .INSERT`<${ev.id}> ${dataCube.baseUri} "${ev.data.baseUri}" .`
    .WHERE`OPTIONAL {
      <${ev.id}> ${dataCube.baseUri} ?currentBase .
    }`

  await execute(query)
})

ProjectEvents.on.ProjectArchived(ev => {
  return execute(DELETE`<${ev.id}> ?p ?o .`)
})

TableEvents.on.FactTableCreated(async function initialiseFactTableResource (ev) {
  await execute(INSERT.DATA`<${ev.data.projectId}> ${dataCube.factTable} <${ev.id}>`)
})

TableEvents.on.TableArchived(async function updateProjectEntity (ev) {
  if (ev.data.isFactTable) {
    const project = await projects
      .load(ev.data.projectId)

    await project.mutation(unselectFactTable)(null as never)
      .commit(projects)
  }
})

ProjectEvents.on.FactTableUnselected(function removeFactTableLink (ev) {
  return execute(DELETE`<${ev.id}> ${dataCube.factTable} ?table`
    .WHERE`
      ?table a ${dataCube.Table} ; ${dataCube.source} <${ev.data.previousSourceId}> .
    `)
})

export function exists (id: string) {
  return execute(ASK`<${id}> ?p ?o`)
}

export async function getProject (id: string): Promise<Project> {
  const dataset = await $rdf.dataset().import(await execute(CONSTRUCT`
    ?project a ?projectType ;
      ${schema.name} ?name ;
      ${api.sources} ?sources ;
      ${dataCube.factTable} ?factTable ;
      ${api.factTable} ?factTableCanonical ;
      ${api.tables} ?tables ;
      ${api.jobs} ?jobs ;
      ${api.s3Bucket} ?s3Bucket ;
      ${dataCube.baseUri} ?baseUri .

    ?sources
        a ${hydra.Collection} ;
        ${hydra.member} ?source ;
        ${hydra.totalItems} ?count .

    ?source ${schema.name} ?sourceName`
    .WHERE`
    BIND (<${id}> as ?project)

    ?project
        ${schema.name} ?name ;
        a ?projectType ;
        ${api.sources} ?sources ;
        ${api.factTable} ?factTableCanonical ;
        ${api.jobs} ?jobs ;
        ${api.tables} ?tables .

    OPTIONAL { ?project ${dataCube.baseUri} ?baseUri . }
    OPTIONAL { ?project ${api.s3Bucket} ?s3Bucket . }

    OPTIONAL
    {
        ?project ${dataCube.factTable} ?factTable .
        ?project ${dataCube.source} ?source .
        ?source ${schema.name} ?sourceName .
    }

    {
        SELECT (COUNT(?source) as ?count)
        {
            BIND (<${id}> as ?project)
            OPTIONAL { ?project ${dataCube.source} ?source }
        }
  }`))

  const project = cf({ dataset })
    .has(rdf.type, dataCube.Project)

  project
    .out(api.sources)
    .addOut(hydra.manages, manages => {
      manages.addOut(hydra.property, rdf.type)
      manages.addOut(hydra.object, dataCube.Source)
    })

  const realFactTable = project.out(dataCube.factTable)
  if (realFactTable.term) {
    project.deleteOut(api.factTable)
  }

  return RdfResourceImpl.factory.createEntity(cf({
    dataset, term: namedNode(id),
  }), [ProjectMixin])
}

export async function hasSource (projectId: string, sourceId: string) {
  return execute(ASK`
    <${projectId}> a ${dataCube.Project}; ${dataCube.source} <${sourceId}> .
  `)
}
