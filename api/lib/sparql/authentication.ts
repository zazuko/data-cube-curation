let authHeader
if (process.env.SPARQL_ENDPOINT_USERNAME && process.env.SPARQL_ENDPOINT_PASSWORD) {
  const user = process.env.SPARQL_ENDPOINT_USERNAME
  const password = process.env.SPARQL_ENDPOINT_PASSWORD

  authHeader = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
}

export default authHeader
