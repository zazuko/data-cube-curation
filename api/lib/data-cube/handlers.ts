import { NextFunction, Request, Response } from 'express'
import { Repository, Entity } from '@tpluscode/fun-ddr'
import { AggregateRoot } from '@tpluscode/fun-ddr/lib'
import asyncMiddleware from 'middleware-async'

interface HandlerOptions<T extends Entity> {
  repository: Repository<T>;
  onGone?: (id: string) => void;
  mutateBeforeDelete?: (current: AggregateRoot<T>, req: Request) => AggregateRoot<T>;
}

export function deleteAggregateHandler<T extends Entity> (options: HandlerOptions<T>) {
  const { repository, onGone, mutateBeforeDelete } = options

  return asyncMiddleware(async function (req: Request, res: Response, next: NextFunction) {
    let aggregateRoot = await repository.load(req.resourceId)

    if (!await aggregateRoot.state) {
      onGone && onGone(req.resourceId)
      res.status(404)
      next()
      return
    }

    aggregateRoot = mutateBeforeDelete ? mutateBeforeDelete(aggregateRoot, req) : aggregateRoot

    await aggregateRoot
      .delete()
      .commit(repository as any)

    res.status(204)
    next()
  })
}
