import { HydraResource, IOperation } from 'alcaeus/types/Resources'

export type Constructor<T = {}> = new (...args: any[]) => HydraResource;

export function findOperation (resource: HydraResource, operationId: string) {
  return resource.operations.find((op: IOperation) => op.supportedOperation.id === operationId) || null
}

export function getOperation (resource: HydraResource, operationId: string) {
  const operation = findOperation(resource, operationId)

  if (!operation) {
    throw new Error(`Operation ${operationId} not found on ${resource.id}`)
  }

  return operation
}

export function findOperationByType (resource: HydraResource, operationType: string) {
  return resource.operations.find((op: IOperation) => op.supportedOperation.types.includes(operationType)) || null
}

export function getOrThrow<T> (resource: HydraResource, property: string): T {
  const value = resource.get(property)

  if (!value) {
    throw new Error(`Property ${property} not defined on ${resource}`)
  }

  return value as T
}
