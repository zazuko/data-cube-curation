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
