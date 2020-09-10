import { ExpressMappingStrategy, HttpProblemResponse } from 'express-http-problem-details'
import { MapperRegistry } from 'http-problem-details-mapper'
import { NotFoundErrorMapper } from './NotFound'
import * as domainMappers from './DomainErrors'
import { RequestErrorMapper } from './RequestError'
import * as forbiddenError from './Forbidden'

const strategy = new ExpressMappingStrategy(
  new MapperRegistry()
    .registerMapper(new NotFoundErrorMapper())
    .registerMapper(new RequestErrorMapper())
    .registerMapper(new domainMappers.DomainErrorMapper())
    .registerMapper(new domainMappers.AggregateNotFoundErrorMapper())
    .registerMapper(new domainMappers.ConcurrencyErrorMapper())
    .registerMapper(new forbiddenError.Mapper()))

export const httpProblemMiddleware = HttpProblemResponse({ strategy })
