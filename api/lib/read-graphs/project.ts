import cf from 'clownface'
import $rdf from 'rdf-ext'
import { ProjectEvents } from '../domain/project/events'
import { handle } from '@tpluscode/fun-ddr'
import { ask, construct, deleteInsert, insertData } from '../sparql'
import { api, dataCube, hydra, schema, rdf } from '../namespaces'
import { getClient } from './sparqlClient'
import { TableEvents } from '../domain/table/events'
import { projects } from '../storage/repository'
import { unselectFactTable } from '../domain/project'

handle<ProjectEvents, 'ProjectCreated'>('ProjectCreated', async ev => {
  await insertData(`
    <${ev.id}> a dataCube:Project; schema:name "${ev.data.name}" .
  `)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
})

handle<ProjectEvents, 'ProjectRenamed'>('ProjectRenamed', async ev => {
  await deleteInsert(`<${ev.id}> schema:name ?currentName .`)
    .insert(`<${ev.id}> schema:name "${ev.data.name}" .`)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
})

handle<ProjectEvents, 'ProjectArchived'>('ProjectArchived', ev => {
  return deleteInsert(`<${ev.id}> ?p ?o .`)
    .execute(getClient())
})

handle<TableEvents, 'FactTableCreated'>('FactTableCreated', async function initialiseFactTableResource (ev) {
  await insertData(`<${ev.data.projectId}> dataCube:factTable <${ev.id}>`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
})

handle<TableEvents, 'TableArchived'>('TableArchived', async function updateProjectEntity (ev) {
  if (ev.data.isFactTable) {
    const project = await projects
      .load(ev.data.projectId)

    await project.mutation(unselectFactTable)(null as never)
      .commit(projects)
  }
})

handle<ProjectEvents, 'FactTableUnselected'>('FactTableUnselected', function removeFactTableLink (ev) {
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

export async function getProject (id: string) {
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
      api:tables ?tables .

    ?sources
        a hydra:Collection ;
        hydra:member ?source ;
        hydra:totalItems ?count .

    ?source schema:name ?sourceName`)
    .where(`
    BIND (<${id}> as ?project)
    BIND (<${id}/sources> as ?sources)
    BIND (<${id}/fact-table> as ?factTable)
    BIND (<${id}/tables> as ?tables)

    ?project
        schema:name ?name ;
        a ?projectType .

    OPTIONAL
    {
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

  cf({ dataset })
    .has(rdf.type, dataCube.Project)
    .out(api.sources)
    .addOut(hydra.manages, manages => {
      manages.addOut(hydra.property, rdf.type)
      manages.addOut(hydra.object, dataCube.Source)
    })

  return dataset
}

export async function hasSource (projectId: string, sourceId: string) {
  return ask(`
    <${projectId}> a dataCube:Project; dataCube:source: <${sourceId}> . 
  `)
    .prefixes({ dataCube })
    .execute(getClient())
}
