import { DomainError, Entity } from '@tpluscode/fun-ddr'

export function errorFactory (entity: Entity, title: string) {
  return class extends DomainError {
    public constructor (reason: string) {
      super(entity['@id'], title, reason)
    }
  }
}
