export interface AggregateRoot<TState extends Entity> {
  state: TState;
  version: number;
  getUnitOfWork(): UnitOfWork<TState>;
}

export interface DomainEvent {
  name: string;
  data: any;
}

export interface Entity {
  '@id': string;
  '@type': string | string[];
}

interface DomainEventEmitter {
  emit(ev: DomainEvent): void;
}

export interface Repository<S extends Entity> {
  save (ar: S, version: number): Promise<void>;
  load (id: string): Promise<AggregateRoot<S> | null>;
}

class UnitOfWork<T extends Entity> implements DomainEventEmitter {
  private __error: Error | null = null
  private __state: T | null = null
  private readonly __events: DomainEvent[] = []
  private readonly __previousVersion: number = 0

  public constructor (init?: AggregateRoot<T> | Error) {
    if (!init) {
      return
    }

    if (init instanceof Error) {
      this.__error = init
    } else if (init) {
      this.__previousVersion = init.version
      this.__state = init.state
    }
  }

  public then<TCommand> (mutator: MutatorFunc<T, TCommand>, cmd: TCommand): UnitOfWork<T> {
    if (!this.__error) {
      try {
        this.__state = mutator.call(this, this.__state, cmd)
      } catch (e) {
        this.__error = e
      }
    }

    return this
  }

  public commit (repo: Repository<T>): Promise<T> {
    if (!this.__error) {
      return repo.save(this.__state, this.__previousVersion + 1)
        .then(() => {
          // todo
          this.__events.forEach(e => console.log(JSON.stringify(e)))
          return this.__state
        })
    }

    return Promise.reject(this.__error)
  }

  public emit (ev: DomainEvent) {
    this.__events.push(ev)
  }
}

export class AR<T extends Entity> implements AggregateRoot<T> {
  public constructor (state: T, version: number) {
    this.state = state
    this.version = version
  }

  public readonly state: T;
  public readonly version: number;

  public getUnitOfWork () {
    return new UnitOfWork(this)
  }
}

type AggregateRootInitFunc<T extends Entity, TArguments> = (this: UnitOfWork<T>, args: TArguments) => T

export function bootstrap<T extends Entity, TArguments> (
  getInitialState: AggregateRootInitFunc<T, TArguments>
): (a: TArguments) => UnitOfWork<T> {
  return function (args: TArguments) {
    const updateSink = new UnitOfWork<T>()

    return updateSink.then(() => getInitialState.call(updateSink, args), args)
  }
}

type CommandRunFunc<T extends Entity, TCommand> = (this: UnitOfWork<T>, state: T, cmd: TCommand) => T
type MutatorFunc<T extends Entity, TCommand> = (a: T, cmd: TCommand) => UnitOfWork<T>

export function mutate<T extends Entity, TCommand> (
  runCommand: CommandRunFunc<T, TCommand>
): MutatorFunc<T, TCommand> {
  return function (this: UnitOfWork<T>, ar: T, cmd: TCommand) {
    return runCommand.call(this || new UnitOfWork<T>(), ar, cmd)
  }
}

type FactoryMethodImpl<T extends Entity, TCommand, TCreated extends Entity> = (this: UnitOfWork<TCreated>, state: T, command: TCommand) => TCreated
type FactoryFunc<T extends Entity, TCommand, TCreated extends Entity> = (a: T, cmd: TCommand) => UnitOfWork<TCreated>

export function factory<T extends Entity, TCommand, TCreated extends Entity> (
  runFactory: FactoryMethodImpl<T, TCommand, TCreated>
): FactoryFunc<T, TCommand, TCreated> {
  const updateSink = new UnitOfWork<TCreated>()

  return (ar: T, cmd: TCommand) => {
    try {
      const newAggregate = runFactory.call(updateSink, ar, cmd)
      return new UnitOfWork<TCreated>(new AR<TCreated>(newAggregate, 0))
    } catch (error) {
      return new UnitOfWork<TCreated>(error)
    }
  }
}
