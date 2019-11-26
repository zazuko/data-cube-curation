import { HydraResource, IOperation } from 'alcaeus/types/Resources'
import debug from 'debug'
import { ResourceId } from '@/types'

const log = debug('api')

export type Constructor<T = {}> = new (...args: any[]) => HydraResource;

export function findOperation (resource: HydraResource, idOrType: ResourceId): IOperation | null {
  const matches = resource.findOperations({
    bySupportedOperation: idOrType
  })

  if (matches.length > 1) {
    log(`More than one match for operation ${idOrType} on ${resource.id}`)
  }

  return matches[0] || null
}

export function getOperation (resource: HydraResource, idOrType: ResourceId): IOperation {
  const operation = findOperation(resource, idOrType)

  if (!operation) {
    throw new Error(`Operation ${idOrType} not found on ${resource.id}`)
  }

  return operation
}

export function getOrThrow<T> (resource: HydraResource, property: string): T {
  const value = resource.get(property)

  if (!value) {
    throw new Error(`Property ${property} not defined on ${resource}`)
  }

  return value as T
}
