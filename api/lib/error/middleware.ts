import { ExpressMappingStrategy, HttpProblemResponse } from 'express-http-problem-details'
import { MapperRegistry } from 'http-problem-details-mapper'
import { NotFoundErrorMapper } from './NotFound'

const strategy = new ExpressMappingStrategy(
  new MapperRegistry()
    .registerMapper(new NotFoundErrorMapper()))

export const httpProblemMiddleware = HttpProblemResponse({ strategy })
