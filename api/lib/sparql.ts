export async function construct (client, query: string) {
  const response = await client.constructQuery(query)

  return response.quadStream()
}

export async function select (client, query: string) {
  const response = await client.selectQuery(query)

  return (await response.json()).results.bindings
}
