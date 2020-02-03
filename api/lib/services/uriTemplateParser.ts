import * as Template from 'uri-template'

export function parse (template: string) {
  return Template.parse(template)
}
