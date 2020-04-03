import { DomainError, Entity } from '@tpluscode/fun-ddr'

export function errorFactory (entity: Entity | string, title: string) {
  const entityId = typeof entity === 'string' ? entity : entity['@id']

  return class extends DomainError {
    public constructor (...reason: string[]) {
      super(entityId, title, reason.join(', '))
    }
  }
}
