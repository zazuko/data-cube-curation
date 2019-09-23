import express from 'express'

export function buildVariables<T extends Record<string, string>> (req: express.DataCubeRequest, mappings: T): Record<keyof T, any> {
  return Object.entries(mappings).reduce((locals, mapping) => {
    const name = mapping[0]
    const property = mapping[1]

    locals[name] = undefined

    req.graph.match(null, property).toArray().map(t => t.object).forEach((value) => {
      if (locals[name]) {
        if (!Array.isArray(locals[name])) {
          locals[name] = [locals[name]]
        }

        locals[name].push(value)
      } else {
        locals[name] = value
      }
    })

    return locals
  }, {} as any)
}
