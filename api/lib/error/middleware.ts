import { ExpressMappingStrategy, HttpProblemResponse } from 'express-http-problem-details'
import { MapperRegistry } from 'http-problem-details-mapper'
import { NotFoundErrorMapper } from './NotFound'
import * as domainMappers from './DomainErrors'
import { RequestErrorMapper } from './RequestError'
import * as authError from './auth'

const strategy = new ExpressMappingStrategy(
  new MapperRegistry()
    .registerMapper(new NotFoundErrorMapper())
    .registerMapper(new RequestErrorMapper())
    .registerMapper(new domainMappers.DomainErrorMapper())
    .registerMapper(new domainMappers.AggregateNotFoundErrorMapper())
    .registerMapper(new domainMappers.ConcurrencyErrorMapper())
    .registerMapper(new authError.ForbiddenMapper())
    .registerMapper(new authError.UnauthorizedMapper()))

export const httpProblemMiddleware = HttpProblemResponse({ strategy })
