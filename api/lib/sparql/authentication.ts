import env from '../env'

let authHeader: string | null = null
if (env.has.SPARQL_ENDPOINT_USERNAME && env.has.SPARQL_ENDPOINT_PASSWORD) {
  const user = env.SPARQL_ENDPOINT_USERNAME
  const password = env.SPARQL_ENDPOINT_PASSWORD

  authHeader = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
}

export default authHeader
