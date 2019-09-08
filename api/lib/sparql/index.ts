import { Builder } from './Builder'

export function construct () {
  return new Builder('CONSTRUCT')
}

export function select (...variables: string[]) {
  return new Builder('SELECT').variables(...variables)
}

export function ask (...patterns: string[]) {
  return new Builder('ASK').where(...patterns)
}
