import { DomainError, Entity } from '@tpluscode/fun-ddr'

export function errorFactory (entity: Entity, title: string) {
  return (reason: string) => {
    return new DomainError(entity['@id'], title, reason)
  }
}
