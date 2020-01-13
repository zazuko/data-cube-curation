import { ensureSlash } from './baseUri'

describe('baseUri', () => {
  describe('ensureSlash', () => {
    it('leaves slash URI intact', () => {
      expect(ensureSlash('http://example.com/')).toEqual('http://example.com/')
      expect(ensureSlash('http://example.com/some/path/')).toEqual('http://example.com/some/path/')
    })

    it('leaves path without slash intact', () => {
      expect(ensureSlash('http://example.com/some/path')).toEqual('http://example.com/some/path')
    })

    it('leaves hash URI intact', () => {
      expect(ensureSlash('http://example.com/some/path#')).toEqual('http://example.com/some/path#')
    })

    it('leaves URN intact', () => {
      expect(ensureSlash('urn:isbn:')).toEqual('urn:isbn:')
    })
  })
})
