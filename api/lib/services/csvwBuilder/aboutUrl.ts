import { Project } from '@zazuko/rdfine-data-cube'
import { ParsedTemplate } from '../uriTemplateParser'
import isUri = require('is-uri')

export function getAbsoluteUrl (project: Project, uriTemplate: ParsedTemplate) {
  if (isUri(uriTemplate.prefix)) {
    return uriTemplate.toString()
  }

  return project.baseUri + uriTemplate.toString()
}
