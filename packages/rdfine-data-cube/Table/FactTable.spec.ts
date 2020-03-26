import cf from 'clownface'
import rdf from 'rdf-ext'
import namespace from '@rdfjs/namespace'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import { Column } from '.'
import { FactTableMixin } from './Table'
import { ColumnMixin } from './Column'
import { ReferenceAttributeMixin, ValueAttributeMixin } from './Attribute'
import { dataCube } from '../namespaces'
import { wireUp } from '../wireUp'

wireUp(RdfResourceImpl.factory)

const ex = namespace('http://example.com/')

describe('FactTable', () => {
  describe('createIdentifier', () => {
    it('creates id for observation table', () => {
      // given
      const graph = cf({ dataset: rdf.dataset() })
      const columns: Column[] = ['foo', 'bar', 'baz'].map((name, order) =>
        new ColumnMixin.Class(graph.node(ex(`column/${order}`)), {
          name,
          order,
        }))
      const table = new FactTableMixin.Class(graph.node(ex('fact-table')), {
        name: 'fact-table',
        project: {
          types: [dataCube.Project],
          id: ex.project,
          baseUri: 'http://foobar.com/',
        },
        source: {
          id: ex.source,
          types: [dataCube.CsvSource],
          columns,
        },
      })
      const fooBazAttr = new ReferenceAttributeMixin.Class(graph.node(ex('attribute/foo-baz')), {
        columnMappings: [{
          [dataCube.sourceColumn.value]: columns[0],
        }, {
          [dataCube.sourceColumn.value]: columns[2],
        }],
      })
      const fooAttr = new ReferenceAttributeMixin.Class(graph.node(ex('attribute/foo')), {
        columnMappings: [{
          types: [dataCube.ColumnMapping],
          [dataCube.sourceColumn.value]: columns[0],
        }],
      })
      fooBazAttr._selfGraph.addOut(dataCube.table, table._selfGraph)
      fooAttr._selfGraph.addOut(dataCube.table, table._selfGraph)

      // when
      const aboutUrl = table.createIdentifier()

      // then
      expect(aboutUrl).toEqual('http://foobar.com/fact-table/{foo}/{baz}')
    })

    it('returns null if there are no referenced attributes', () => {
      // given
      const graph = cf({ dataset: rdf.dataset() })
      const columns: Column[] = ['foo', 'bar', 'baz'].map((name, order) =>
        new ColumnMixin.Class(graph.node(ex(`column/${order}`)), {
          name,
          order,
        }))
      const table = new FactTableMixin.Class(graph.node(ex('fact-table')), {
        name: 'fact-table',
        project: {
          types: [dataCube.Project],
          id: ex.project,
          baseUri: 'http://foobar.com/',
        },
        source: {
          id: ex.source,
          types: [dataCube.CsvSource],
          columns,
        },
      })
      const fooAttr = new ValueAttributeMixin.Class(graph.node(ex('attribute/foo')))
      fooAttr._selfGraph.addOut(dataCube.table, table._selfGraph)

      // when
      const aboutUrl = table.createIdentifier()

      // then
      expect(aboutUrl).toBeNull()
    })
  })
})
