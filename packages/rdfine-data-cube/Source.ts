import { property, Constructor, RdfResource } from '@tpluscode/rdfine'
import { dataCube, schema } from './namespaces'
import * as Csvw from './index'

export function SourceMixin<Base extends Constructor> (base: Base) {
  class Source extends base implements Csvw.Source {
    @property.literal({ path: schema.name })
    public name!: string;
  }

  return Source
}

export function CsvSourceMixin<Base extends Constructor<Csvw.Source>> (base: Base) {
  class CsvSource extends base implements Csvw.CsvSource {
    @property.literal({ path: dataCube.csvQuote })
    quote: string;

    @property.literal({ path: dataCube.csvDelimiter })
    delimiter: string;
  }

  return CsvSource
}

CsvSourceMixin.shouldApply = (r: RdfResource) => r.hasType(dataCube.CsvSource)
