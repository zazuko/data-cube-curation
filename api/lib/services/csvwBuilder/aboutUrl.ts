import { Project } from '@zazuko/rdfine-data-cube'
import isUri = require('is-uri')

export function getAbsoluteUrl (project: Project, uriTemplate: any) {
  uriTemplate.expressions.forEach(expression => {
    expression.params.forEach(p => {
      // TODO: required until grncdr/uri-template#19 is fixed
      p.explode = ''
    })
  })

  if (isUri(uriTemplate.prefix)) {
    return uriTemplate.toString()
  }

  return project.baseUri + uriTemplate.toString()
}
