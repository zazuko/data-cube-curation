import { ErrorMapper } from 'http-problem-details-mapper'
import { ProblemDocument } from 'http-problem-details'
import httpError from 'http-errors'
import env from '../env'

export class Mapper extends ErrorMapper {
  public constructor () {
    super(httpError.Forbidden)
  }

  mapError (): ProblemDocument {
    return new ProblemDocument({
      status: 403,
      title: 'Access denied',
      detail: 'Follow the link to request access to this page:',
      type: 'http://tempuri.org/Forbidden',
    }, {
      link: {
        title: 'Request access',
        href: `${env.AUTH_ACCESS_REQUEST}`,
      },
    })
  }
}
