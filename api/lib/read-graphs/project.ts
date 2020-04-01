import cf from 'clownface'
import { Project } from '@zazuko/rdfine-data-cube'
import { ProjectMixin } from '@zazuko/rdfine-data-cube/Project'
import { schema, hydra, rdf } from '@tpluscode/rdf-ns-builders'
import { ASK, CONSTRUCT, DELETE, INSERT } from '@tpluscode/sparql-builder'
import ProjectEvents from '../domain/project/events'
import { ask, construct, update } from '../sparql'
import { api, dataCube } from '../namespaces'
import TableEvents from '../domain/table/events'
import { projects } from '../storage/repository'
import { unselectFactTable } from '../domain/project'
import { namedNode } from '@rdfjs/data-model'

ProjectEvents.on.ProjectCreated(async ev => {
  let insert = INSERT.DATA`
    <${ev.id}> a ${dataCube.Project}; ${schema.name} "${ev.data.name}" ;
       ${api.s3Bucket} "${ev.data.s3Bucket}" ;
       ${dataCube.baseUri} "${ev.data.baseUri}" .

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

  if (typeof ev.data.graphUri !== 'undefined' && ev.data.graphUri !== null) {
    insert = insert.DATA`<${ev.id}> ${dataCube.graphUri} "${ev.data.graphUri}" .`
  }

  await update(insert)
})

ProjectEvents.on.ProjectRenamed(async ev => {
  const query = DELETE`<${ev.id}> ${schema.name} ?currentName .`
    .INSERT`<${ev.id}> ${schema.name} "${ev.data.name}" .`

  await update(query)
})

ProjectEvents.on.S3BucketChanged(async ev => {
  const query = DELETE`<${ev.id}> ${api.s3Bucket} ?current .`
    .INSERT`<${ev.id}> ${api.s3Bucket} "${ev.data.s3Bucket}" .`
    .WHERE`OPTIONAL {
        <${ev.id}> ${api.s3Bucket} ?current .
      }`

  await update(query)
})

ProjectEvents.on.GraphUriChanged(async ev => {
  const query = DELETE`<${ev.id}> ${dataCube.graphUri} ?current .`
    .INSERT`<${ev.id}> ${dataCube.graphUri} "${ev.data.graphUri}" .`
    .WHERE`OPTIONAL {
      <${ev.id}> ${dataCube.graphUri} ?current .
    }`

  await update(query)
})

ProjectEvents.on.ProjectRebased(async ev => {
  const query = DELETE`<${ev.id}> ${dataCube.baseUri} ?currentBase .`
    .INSERT`<${ev.id}> ${dataCube.baseUri} "${ev.data.baseUri}" .`
    .WHERE`OPTIONAL {
      <${ev.id}> ${dataCube.baseUri} ?currentBase .
    }`

  await update(query)
})

ProjectEvents.on.ProjectArchived(ev => {
  return update(DELETE`<${ev.id}> ?p ?o .`)
})

TableEvents.on.FactTableCreated(async function initialiseFactTableResource (ev) {
  await update(INSERT.DATA`<${ev.data.projectId}> ${dataCube.factTable} <${ev.id}>`)
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
  return update(DELETE`<${ev.id}> ${dataCube.factTable} ?table`
    .WHERE`
      ?table a ${dataCube.Table} ; ${dataCube.source} <${ev.data.previousSourceId}> .
    `)
})

export function exists (id: string) {
  return ask(ASK`<${id}> ?p ?o`)
}

export async function getProject (id: string): Promise<Project> {
  const dataset = await construct(CONSTRUCT`
    ?project a ?projectType ;
      ${schema.name} ?name ;
      ${api.sources} ?sources ;
      ${dataCube.factTable} ?factTable ;
      ${api.factTable} ?factTableCanonical ;
      ${api.tables} ?tables ;
      ${api.jobs} ?jobs ;
      ${api.s3Bucket} ?s3Bucket ;
      ${dataCube.baseUri} ?baseUri ;
      ${dataCube.graphUri} ?graphUri.

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
    OPTIONAL { ?project ${dataCube.graphUri} ?graphUri . }
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
  }`)

  const project = cf({ dataset })
    .has(rdf.type, dataCube.Project)

  project
    .out(api.sources)
    .addOut(hydra.manages, manages => {
      manages.addOut(hydra.property, rdf.type)
      manages.addOut(hydra.object, dataCube.Source)
    })

  return new ProjectMixin.Class({
    dataset, term: namedNode(id),
  })
}

export async function hasSource (projectId: string, sourceId: string) {
  return ask(ASK`
    <${projectId}> a ${dataCube.Project}; ${dataCube.source} <${sourceId}> .
  `)
}
