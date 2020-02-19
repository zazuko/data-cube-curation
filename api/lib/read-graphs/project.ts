import cf from 'clownface'
import $rdf from 'rdf-ext'
import ProjectEvents from '../domain/project/events'
import { ask, construct, deleteInsert, insertData } from '../sparql'
import { api, dataCube, hydra, schema, rdf } from '../namespaces'
import { getClient } from './sparqlClient'
import TableEvents from '../domain/table/events'
import { projects } from '../storage/repository'
import { unselectFactTable } from '../domain/project'
import { Project } from '@zazuko/rdfine-data-cube'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import { namedNode } from 'rdf-data-model'
import { ProjectMixin } from '@zazuko/rdfine-data-cube/Project'

ProjectEvents.on.ProjectCreated(async ev => {
  await insertData(`
    <${ev.id}> a dataCube:Project; schema:name "${ev.data.name}" ;
       api:s3Bucket "${ev.data.s3Bucket}" ;
       dataCube:baseUri "${ev.data.baseUri}" .
    <${ev.id}/tables> dataCube:project <${ev.id}> .
    <${ev.id}/jobs> dataCube:project <${ev.id}> .
    <${ev.id}/sources> dataCube:project <${ev.id}> .
    <${ev.id}/fact-table> dataCube:project <${ev.id}> .
    <${ev.id}>
        api:tables <${ev.id}/tables> ;
        api:jobs <${ev.id}/jobs> ;
        api:sources <${ev.id}/sources> ;
        api:factTable <${ev.id}/fact-table> .
  `)
    .prefixes({
      schema,
      dataCube,
      api,
    })
    .execute(getClient())
})

ProjectEvents.on.ProjectRenamed(async ev => {
  await deleteInsert(`<${ev.id}> schema:name ?currentName .`)
    .insert(`<${ev.id}> schema:name "${ev.data.name}" .`)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
})

ProjectEvents.on.S3BucketChanged(async ev => {
  await deleteInsert(`<${ev.id}> api:s3Bucket ?current .`)
    .insert(`<${ev.id}> api:s3Bucket "${ev.data.s3Bucket}" .`)
    .where(`OPTIONAL {
      <${ev.id}> api:s3Bucket ?current .
    }`)
    .prefixes({
      api,
    })
    .execute(getClient())
})

ProjectEvents.on.ProjectRebased(async ev => {
  await deleteInsert(`<${ev.id}> dataCube:baseUri ?currentBase .`)
    .insert(`<${ev.id}> dataCube:baseUri "${ev.data.baseUri}" .`)
    .where(`OPTIONAL {
      <${ev.id}> dataCube:baseUri ?currentBase .
    }`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
})

ProjectEvents.on.ProjectArchived(ev => {
  return deleteInsert(`<${ev.id}> ?p ?o .`)
    .execute(getClient())
})

TableEvents.on.FactTableCreated(async function initialiseFactTableResource (ev) {
  await insertData(`<${ev.data.projectId}> dataCube:factTable <${ev.id}>`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
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
  return deleteInsert(`<${ev.id}> dataCube:factTable ?table`)
    .where(`
      ?table a dataCube:Table ; dataCube:source <${ev.data.previousSourceId}> .
    `)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
})

export function exists (id: string) {
  return ask(`<${id}> ?p ?o`).execute(getClient())
}

export async function getProject (id: string): Promise<Project> {
  const dataset = await $rdf.dataset().import(await construct()
    .prefixes({
      api,
      dataCube,
      schema,
      hydra,
    })
    .graph(`
    ?project a ?projectType ;
      schema:name ?name ;
      api:sources ?sources ;
      dataCube:factTable ?factTable ;
      api:factTable ?factTableCanonical ;
      api:tables ?tables ;
      api:jobs ?jobs ;
      api:s3Bucket ?s3Bucket ;
      dataCube:baseUri ?baseUri .

    ?sources
        a hydra:Collection ;
        hydra:member ?source ;
        hydra:totalItems ?count .

    ?source schema:name ?sourceName`)
    .where(`
    BIND (<${id}> as ?project)

    ?project
        schema:name ?name ;
        a ?projectType ;
        api:sources ?sources ;
        api:factTable ?factTableCanonical ;
        api:jobs ?jobs ;
        api:tables ?tables .

    OPTIONAL { ?project dataCube:baseUri ?baseUri . }
    OPTIONAL { ?project api:s3Bucket ?s3Bucket . }

    OPTIONAL
    {
        ?project dataCube:factTable ?factTable .
        ?project dataCube:source ?source .
        ?source schema:name ?sourceName .
    }

    {
        SELECT (COUNT(?source) as ?count)
        {
            BIND (<${id}> as ?project)
            OPTIONAL { ?project dataCube:source ?source }
        }
  }`).execute(getClient()))

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
  return ask(`
    <${projectId}> a dataCube:Project; dataCube:source <${sourceId}> .
  `)
    .prefixes({ dataCube })
    .execute(getClient())
}
