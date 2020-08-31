import fetch from 'node-fetch'
import { Debugger } from 'debug'
import querystring from 'querystring'
import Hydra from 'alcaeus'

let log: Debugger

export type AuthConfig = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  params: Map<string, string>;
}

type Metadata = {
  token_endpoint: string;
}

type Token = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

type LiveToken = Token & {
  expiration: number;
}

function isValid (token: LiveToken) {
  return token.expiration > Date.now() + 60 * 1000
}

let metadata: Metadata | null = null
async function getMetadata (config: AuthConfig): Promise<Metadata> {
  if (!metadata) {
    const response = await fetch(
      `${config.issuer}/.well-known/openid-configuration`
    )
    metadata = (await response.json()) as Metadata
  }
  return metadata
}

let token: LiveToken | null = null
async function getToken (config: AuthConfig): Promise<LiveToken> {
  if (!token || !isValid(token)) {
    const m = await getMetadata(config)

    const params = {}
    params['grant_type'] = 'client_credentials'
    params['client_id'] = config.clientId
    params['client_secret'] = config.clientSecret

    config.params.forEach((value, key) => (params[key] = value))

    const response = await fetch(m['token_endpoint'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(params),
    })

    const t = (await response.json()) as Token

    if (t['error']) {
      throw new Error(t['error_description'] || t['error'])
    }

    log('Renewed access token', t)

    const expiration = Date.now() + t.expires_in * 1000
    token = {
      ...t,
      expiration,
    }
  }

  return token
}

async function renew (config: AuthConfig) {
  const t = await getToken(config)
  Hydra.defaultHeaders = {
    Authorization: `Bearer ${t['access_token']}`,
  }
}

let interval: NodeJS.Timeout | null = null
export function stopRenewing () {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

export async function setupAuthentication (config: AuthConfig, log_: Debugger) {
  log = log_
  await renew(config)
  interval = setInterval(() => renew(config), 1000)
}
