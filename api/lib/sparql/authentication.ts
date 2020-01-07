import env from '../env'

let authHeader
if (env.SPARQL_ENDPOINT_USERNAME && env.SPARQL_ENDPOINT_PASSWORD) {
  const user = env.SPARQL_ENDPOINT_USERNAME
  const password = env.SPARQL_ENDPOINT_PASSWORD

  authHeader = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
}

export default authHeader
