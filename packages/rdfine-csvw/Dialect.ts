import { Constructor, namespace, property } from '@tpluscode/rdfine'
import { csvw } from '@tpluscode/rdf-ns-builders'
import * as Csvw from '.'

export function CsvwDialectMixin<Base extends Constructor> (base: Base) {
  @namespace(csvw)
  class Dialect extends base implements Csvw.Dialect {
    @property.literal()
    delimiter: string;

    @property.literal({ path: 'quoteChar' })
    quote: string;

    @property.literal({
      type: Boolean,
      initial: true,
    })
    header: boolean

    get isSet () {
      return typeof this.delimiter !== 'undefined' && typeof this.quote !== 'undefined'
    }
  }

  return Dialect
}
