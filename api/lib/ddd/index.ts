import { emit } from './events'

export interface AggregateRoot<TState extends Entity> {
  state: TState;
  version: number;

  mutation<TCommand> (mutator: MutatorFunc<TState, TCommand>): (cmd: TCommand) => AggregateRoot<TState>;
  factory<TCommand, TCreated extends Entity> (factoryFunc: FactoryFunc<TState, TCommand, TCreated>): (cmd: TCommand) => AggregateRoot<TCreated>;
  commit (repo: Repository<TState>): Promise<TState>;
}

export interface DomainEvent<T = unknown> {
  name: string;
  data: T;
  id: string;
}

export interface Entity {
  '@id': string;
  '@type': string | string[];
}

interface DomainEventEmitter {
  emit<T extends Record<string, any>, K extends keyof Pick<T, string>>(name: K, value: T[K]): void;
}

export interface Repository<S extends Entity> {
  save (ar: S, version: number): Promise<void>;
  load (id: string): Promise<AggregateRoot<S> | null>;
}

export class AggregateRootImpl<T extends Entity> implements AggregateRoot<T>, DomainEventEmitter {
  private __error: Error | null = null
  private __state: T | null = null
  private readonly __events: { name: string; data: any }[] = []
  private readonly __previousVersion: number = 0

  public get state () {
    return this.__state
  }

  public get version () {
    return this.__previousVersion
  }

  public constructor (state?: T | Error, version?: number) {
    if (!state) {
      return
    }

    if (state instanceof Error) {
      this.__error = state
    } else if (state) {
      this.__previousVersion = version
      this.__state = state
    }
  }

  public mutation<TCommand> (mutator: MutatorFunc<T, TCommand>): (cmd: TCommand) => AggregateRoot<T> {
    return (cmd: TCommand) => {
      if (!this.__error) {
        try {
          this.__state = mutator.call(this, this.__state, cmd)
        } catch (e) {
          this.__error = e
        }
      }

      return this
    }
  }

  public factory<TCommand, TCreated extends Entity> (factoryFunc: FactoryFunc<T, TCommand, TCreated>): (cmd: TCommand) => AggregateRoot<TCreated> {
    return (cmd: TCommand) => {
      if (!this.__error) {
        try {
          return factoryFunc(this.state, cmd)
        } catch (e) {
          this.__error = e
        }
      }

      return new AggregateRootImpl<TCreated>(this.__error)
    }
  }

  public commit (repo: Repository<T>): Promise<T> {
    if (!this.__error) {
      return repo.save(this.__state, this.__previousVersion + 1)
        .then(() => {
          this.__events.forEach(e => emit(e.name, {
            id: this.state['@id'],
            ...e,
          }))
          return this.__state
        })
    }

    return Promise.reject(this.__error)
  }

  public emit<T extends Record<string, unknown>, K extends keyof Pick<T, string>> (name: K, data: T[K]) {
    this.__events.push({
      name,
      data,
    })
  }
}

type AggregateRootInitFunc<T extends Entity, TArguments> = (this: DomainEventEmitter, args: TArguments) => T

export function bootstrap<T extends Entity, TArguments> (
  getInitialState: AggregateRootInitFunc<T, TArguments>
): (a: TArguments) => AggregateRoot<T> {
  return function (args: TArguments) {
    const updateSink = new AggregateRootImpl<T>()

    return updateSink.mutation(() => getInitialState.call(updateSink, args))(args)
  }
}

type CommandRunFunc<T extends Entity, TCommand> = (this: DomainEventEmitter, state: T, cmd: TCommand) => T
type MutatorFunc<T extends Entity, TCommand> = (a: T, cmd: TCommand) => T

export function mutate<T extends Entity, TCommand> (
  runCommand: CommandRunFunc<T, TCommand>
): MutatorFunc<T, TCommand> {
  return function (this: DomainEventEmitter, ar: T, cmd: TCommand) {
    return runCommand.call(this, ar, cmd)
  }
}

type FactoryMethodImpl<T extends Entity, TCommand, TCreated extends Entity> = (this: DomainEventEmitter, state: T, command: TCommand) => TCreated
type FactoryFunc<T extends Entity, TCommand, TCreated extends Entity> = (parent: T, cmd: TCommand) => AggregateRoot<TCreated>

export function factory<T extends Entity, TCommand, TCreated extends Entity> (
  runFactory: FactoryMethodImpl<T, TCommand, TCreated>
): FactoryFunc<T, TCommand, TCreated> {
  return (parent: T, cmd: TCommand) => {
    try {
      const ar = new AggregateRootImpl<TCreated>()
      return ar.mutation<TCommand>(a => {
        return runFactory.call(a, parent, cmd) as TCreated
      })(cmd)
    } catch (error) {
      return new AggregateRootImpl<TCreated>(error)
    }
  }
}
