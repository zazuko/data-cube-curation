import { mutate } from '@tpluscode/fun-ddr'
import { CsvSource } from './index'
import { errorFactory } from '../error-helper'
import { CsvSourceEvents } from './events'

interface UpdateCommand {
  name?: string;
  delimiter?: string;
  quote?: string;
}

export const updateSource = mutate<CsvSource, UpdateCommand, CsvSourceEvents>((source, command, emitter) => {
  const DomainError = errorFactory(source, 'Cannot update source')

  const { name, delimiter, quote } = command
  if (!name) {
    throw new DomainError('Name cannot be empty')
  }
  if (!quote) {
    throw new DomainError('Quote character cannot be empty')
  }
  if (!delimiter) {
    throw new DomainError('Delimiter cannot be empty')
  }

  if (name !== source.name) {
    emitter.emit.NameChanged({
      newName: name,
    })
  }

  if (delimiter !== source.delimiter) {
    emitter.emit.DelimiterChanged({
      newDelimiter: delimiter,
    })
  }

  if (quote !== source.quote) {
    emitter.emit.QuoteChanged({
      newQuote: quote,
    })
  }

  return {
    ...source,
    name,
    delimiter,
    quote,
  }
})
