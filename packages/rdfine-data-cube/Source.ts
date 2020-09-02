import { property, Constructor } from '@tpluscode/rdfine'
import { schema } from '@tpluscode/rdf-ns-builders'
import { dataCube } from './namespaces'
import * as DataCube from './index'

export function SourceMixin<Base extends Constructor> (base: Base) {
  class Source extends base implements DataCube.Source {
    @property.literal({ path: schema.name })
    public name!: string;

    @property.resource({ path: dataCube.column, values: 'array' })
    public columns!: DataCube.Column[]
  }

  return Source
}

export function CsvSourceMixin<Base extends Constructor<DataCube.Source>> (base: Base) {
  class CsvSource extends SourceMixin(base) implements DataCube.CsvSource {
    @property.literal({ path: dataCube.csvQuote })
    quote: string;

    @property.literal({ path: dataCube.csvDelimiter })
    delimiter: string;
  }

  return CsvSource
}

CsvSourceMixin.appliesTo = dataCube.CsvSource
