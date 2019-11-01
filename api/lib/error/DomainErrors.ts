import * as error from '@tpluscode/fun-ddr/lib/errors'
import { ErrorMapper } from 'http-problem-details-mapper'
import { ProblemDocument } from 'http-problem-details'

export class AggregateNotFoundErrorMapper extends ErrorMapper {
  public constructor() {
    super(error.AggregateNotFoundError)
  }

  public mapError(error: error.AggregateNotFoundError) {
    return new ProblemDocument({
      status: 404,
      title: 'Resource not found',
      detail: error.message,
      type: 'http://tempuri.org/NotFoundError',
    })
  }
}

export class ConcurrencyErrorMapper extends ErrorMapper {
  public constructor() {
    super(error.ConcurrencyError)
  }

  public mapError(error: error.ConcurrencyError) {
    return new ProblemDocument({
      status: 409,
      title: error.message,
      detail: error.reason,
      type: 'http://tempuri.org/ConcurrencyError',
    })
  }
}

export class DomainErrorMapper extends ErrorMapper {
  public constructor() {
    super(error.DomainError)
  }

  public mapError(error: error.DomainError) {
    return new ProblemDocument({
      status: 400,
      title: error.title,
      detail: error.reason,
      type: 'http://tempuri.org/DomainError',
    })
  }
}
