import { addAttribute } from './addAttribute'
import { Table } from './index'
import { expand } from '@zazuko/rdf-vocabularies'

describe('table', () => {
  let table: Table

  const command = {
    name: 'foo-bar',
    columnId: 'source/column',
    predicate: expand('schema:name'),
  }

  beforeEach(() => {
    table = {
      '@id': 'example/table',
      '@type': 'Table',
      sourceId: 'unimportant/source',
      projectId: 'unimportant/project',
    }
  })

  describe('add attribute', () => {
    it('errors when name is missing', async () => {
      // given
      const cmd = { ...command }
      delete cmd.name

      // when
      const result = await addAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(Error)
    })

    it('errors when column is missing', async () => {
      // given
      const cmd = { ...command }
      delete cmd.columnId

      // when
      const result = await addAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(Error)
    })

    it('errors when predicate is missing', async () => {
      // given
      const cmd = { ...command }
      delete cmd.predicate

      // when
      const result = await addAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(Error)
    })

    it('errors when datatype is used together with language', async () => {
      // given
      const cmd = {
        ...command,
        datatype: expand('xsd:integer'),
        language: 'fr',
      }

      // when
      const result = await addAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(Error)
    })

    it('return expected state', async () => {
      // when
      const result = await addAttribute(table, command)

      // then
      await expect(result.state).resolves.toMatchSnapshot()
    })

    it('emits an event', async () => {
      // given
      const result = await addAttribute(table, command)

      // then
      await expect(result.events).resolves.toMatchSnapshot()
    })
  })
})
