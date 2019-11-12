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

handle<ProjectEvents, 'ProjectCreated'>('ProjectCreated', ev => {
  insertData(`
    <${ev.id}> a dataCube:Project; schema:name "${ev.data.name}" .
  `)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<ProjectEvents, 'ProjectRenamed'>('ProjectRenamed', ev => {
  deleteInsert(`<${ev.id}> schema:name ?currentName .`)
    .insert(`<${ev.id}> schema:name "${ev.data.name}" .`)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<ProjectEvents, 'ProjectArchived'>('ProjectArchived', ev => {
  deleteInsert(`<${ev.id}> ?p ?o .`)
    .execute(getClient())
    .catch(console.error)
})

handle<TableEvents, 'FactTableCreated'>('FactTableCreated', function initialiseFactTableResource (ev) {
  insertData(`<${ev.data.projectId}> dataCube:factTable <${ev.id}>`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<TableEvents, 'TableArchived'>('TableArchived', async function updateProjectEntity (ev) {
  if (ev.data.isFactTable) {
    const project = await projects
      .load(ev.data.projectId)

    project.mutation(unselectFactTable)(null as never)
      .commit(projects)
      .catch(console.error)
  }
})

handle<ProjectEvents, 'FactTableUnselected'>('FactTableUnselected', function removeFactTableLink (ev) {
  deleteInsert(`<${ev.id}> dataCube:factTable ?table`)
    .where(`
      ?table a dataCube:Table ; dataCube:source <${ev.data.previousSourceId}> .
    `)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
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
  `).execute(getClient())
}
