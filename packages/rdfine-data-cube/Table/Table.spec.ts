import { blankNode } from '@rdfjs/data-model'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import rdf from 'rdf-ext'
import { TableMixin } from './Table'
import { dataCube } from '../namespaces'
import { wireUp } from '../wireUp'

wireUp(RdfResourceImpl.factory)

describe('Table', () => {
  describe('createIdentifier', () => {
    it('concatenates project base when identifier template is not absolute', async () => {
      // given
      const node = { dataset: rdf.dataset(), term: blankNode() }
      const table = new TableMixin.Class(node, {
        identifierTemplate: 'table/{foo}/{bar}',
        project: {
          types: [dataCube.Project],
          baseUri: 'http://example.com/tst-project/',
        },
      })

      // when
      const aboutUrl = table.createIdentifier()

      // then
      expect(aboutUrl).toEqual('http://example.com/tst-project/table/{foo}/{bar}')
    })

    it('uses absolute identifierTemplate for aboutUrl', async () => {
      // given
      const node = { dataset: rdf.dataset(), term: blankNode() }
      const table = new TableMixin.Class(node, {
        identifierTemplate: 'http://example.com/{foo}/{bar}',
        project: {
          types: [dataCube.Project],
          baseUri: 'http://example.com/tst-project/',
        },
      })

      // when
      const aboutUrl = table.createIdentifier()

      // then
      expect(aboutUrl).toEqual('http://example.com/{foo}/{bar}')
    })
  })
})
