import { ErrorMapper } from 'http-problem-details-mapper'
import { ProblemDocument } from 'http-problem-details'

export class RequestError extends Error {
  public status = 400
}

export class RequestErrorMapper extends ErrorMapper {
  public constructor () {
    super(RequestError)
  }

  public mapError (error: RequestError): ProblemDocument {
    return new ProblemDocument({
      status: error.status,
      title: 'Failed to process request',
      detail: error.message,
      type: 'http://tempuri.org/BadRequest',
    })
  }
}
