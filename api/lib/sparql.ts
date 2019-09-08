import { NamedNode } from 'rdf-js'

function buildPrefixes (prefixes: Record<string, (term: string) => NamedNode>) {
  return Object.entries(prefixes)
    .map(p => `PREFIX ${p[0]}: <${p[1]('').value}>`).join('\n')
}

export async function construct (client, prefixes: any, graph: string, patterns: string = '') {
  const response = await client.constructQuery(`${buildPrefixes(prefixes)} CONSTRUCT { ${graph} } WHERE { ${patterns} }`)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.quadStream()
}

export async function select (client, query: string) {
  const response = await client.selectQuery(query)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return (await response.json()).results.bindings
}

export async function ask (client, ...patterns: string[]): Promise<boolean> {
  const response = await client.selectQuery(`ASK { ${patterns.join('\n')} }`)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()

  return json.boolean
}
