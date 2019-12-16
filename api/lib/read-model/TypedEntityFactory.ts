import TypedClownfaceEntity from './TypedClownfaceEntity'
import Clownface from 'clownface/lib/Clownface'

export type Constructor<T = TypedClownfaceEntity> = new (...args: any[]) => T;
interface ShouldApply {
  shouldApply: boolean | ((entity: TypedClownfaceEntity) => boolean);
}

export type Mixin<T> = (<TBase extends Constructor<T>>(Base: TBase) => any)

class Factory {
  private __mixins: Constructor[] = []

  public addMixin<T> (mixin: Mixin<T> & ShouldApply) {
    this.__mixins.push(mixin as any)
  }

  public createEntity<T> (term: Clownface, explicitMixins: Mixin<any>[] = []): TypedClownfaceEntity & T {
    const entity = new TypedClownfaceEntity(term)

    const mixins = this.__mixins.reduce((selected, next: any) => {
      if (next.shouldApply === true || next.shouldApply(entity)) {
        if (!selected.includes(next)) {
          selected.push(next)
        }
      }

      return selected
    }, [ ...explicitMixins ])

    const Type = mixins.reduce<Constructor>((Mixed, Next: any) => Next(Mixed), TypedClownfaceEntity)

    return new Type(term) as unknown as TypedClownfaceEntity & T
  }
}

export const factory = new Factory()
