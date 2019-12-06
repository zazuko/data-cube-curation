import { ExpressMappingStrategy, HttpProblemResponse } from 'express-http-problem-details'
import { MapperRegistry } from 'http-problem-details-mapper'
import { NotFoundErrorMapper } from './NotFound'
import * as domainMappers from './DomainErrors'
import { RequestErrorMapper } from './RequestError'

const strategy = new ExpressMappingStrategy(
  new MapperRegistry()
    .registerMapper(new NotFoundErrorMapper())
    .registerMapper(new RequestErrorMapper())
    .registerMapper(new domainMappers.DomainErrorMapper())
    .registerMapper(new domainMappers.AggregateNotFoundErrorMapper())
    .registerMapper(new domainMappers.ConcurrencyErrorMapper()))

export const httpProblemMiddleware = HttpProblemResponse({ strategy })
