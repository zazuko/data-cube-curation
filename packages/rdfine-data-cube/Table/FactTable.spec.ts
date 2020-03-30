import cf from 'clownface'
import rdf from 'rdf-ext'
import namespace from '@rdfjs/namespace'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import { Column } from '.'
import { FactTableMixin } from './Table'
import { ColumnMixin } from './Column'
import { ReferenceAttributeMixin } from './Attribute'
import { dataCube } from '../namespaces'
import { wireUp } from '../wireUp'

wireUp(RdfResourceImpl.factory)

const ex = namespace('http://example.com/')

describe('FactTable', () => {
  describe('createIdentifier', () => {
    it('returns null when there is no template', () => {
      // given
      const graph = cf({ dataset: rdf.dataset() })

      // when
      const table = new FactTableMixin.Class(graph.blankNode())

      // then
      expect(table.createIdentifier()).toBeNull()
    })
  })

  describe('missingIdentifierColumns', () => {
    it('returns columns which are used in referenced tables but not in identifier', () => {
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
        },
        source: {
          id: ex.source,
          types: [dataCube.CsvSource],
          columns,
        },
        identifierTemplate: 'http://example.com/fact/{bar}',
      })
      const fooAttr = new ReferenceAttributeMixin.Class(graph.node(ex('attribute/foo')), {
        columnMappings: [{
          types: [dataCube.ColumnMapping],
          [dataCube.sourceColumn.value]: columns[0],
        }],
      })
      fooAttr._selfGraph.addOut(dataCube.table, table._selfGraph)

      // when
      const aboutUrl = table.missingIdentifierColumns

      // then
      expect(aboutUrl).toEqual(
        expect.arrayContaining([columns[0].name])
      )
    })

    it('returns empty array when table has no identifier template', () => {
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
        },
        source: {
          id: ex.source,
          types: [dataCube.CsvSource],
          columns,
        },
      })
      const fooAttr = new ReferenceAttributeMixin.Class(graph.node(ex('attribute/foo')), {
        columnMappings: [{
          types: [dataCube.ColumnMapping],
          [dataCube.sourceColumn.value]: columns[0],
        }],
      })
      fooAttr._selfGraph.addOut(dataCube.table, table._selfGraph)

      // when
      const aboutUrl = table.missingIdentifierColumns

      // then
      expect(aboutUrl).toEqual([])
    })
  })
})
