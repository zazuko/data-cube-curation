import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { namedNode } from 'rdf-data-model'
import { triggerPipeline } from './gitLab'
import env from '../../env'

jest.mock('../../env')

const envMock = env as any as jest.SpyInstance

describe('gitlab trigger', () => {
  beforeAll(() => {
    env.GITLAB_PIPELINE = 'http://gitlab/'
    env.GITLAB_PIPELINE_TOKEN = 'GITLAB_PIPELINE_TOKEN'
    env.GITLAB_PIPELINE_BRANCH = 'master'
    env.AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID'
    env.AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY'
    env.AWS_S3_ENDPOINT = 'AWS_S3_ENDPOINT'
    env.GRAPH_STORE_ENDPOINT = 'GRAPH_STORE_ENDPOINT'
    env.GRAPH_STORE_USER = 'GRAPH_STORE_USER'
    env.GRAPH_STORE_PASSWORD = 'GRAPH_STORE_PASSWORD'
    fetchMock.enableMocks()
  })

  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.doMock()
  })

  afterAll(() => {
    fetchMock.disableMocks()
    envMock.mockRestore()
  })

  it('throws if S3 bucket is not given', () => {
    // given
    const project = {
      id: namedNode('foo:bar'),
      s3Bucket: undefined,
      graphUri: 'urn:foo:bar',
    }

    // then
    expect(() => {
      // when
      triggerPipeline(project, { graphUri: undefined, s3Bucket: undefined })
    }).toThrow()
  })

  it('throws if graph name is not given', () => {
    // given
    const project = {
      id: namedNode('foo:bar'),
      s3Bucket: 'foobar',
      graphUri: undefined,
    }

    // then
    expect(() => {
      // when
      triggerPipeline(project, { graphUri: undefined, s3Bucket: undefined })
    }).toThrow()
  })

  it('calls gitlab trigger endpoint with project\'s settings', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      id: 1234,
      'web_url': 'http://foo.com/1234',
    }))
    // given
    const project = {
      id: namedNode('foo:bar'),
      s3Bucket: 'foo',
      graphUri: 'urn:foo:bar',
    }

    // when
    const job = await triggerPipeline(project, { graphUri: undefined, s3Bucket: undefined })

    // then
    expect(job).toMatchSnapshot()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })

  it('calls gitlab trigger endpoint with overridden settings', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      id: 5678,
      'web_url': 'http://foo.com/5678',
    }))

    // given
    const project = {
      id: namedNode('foo:bar'),
      s3Bucket: 'foo',
      graphUri: 'urn:foo:bar',
    }

    // when
    const job = await triggerPipeline(project, {
      s3Bucket: 'changed bucket',
      graphUri: 'urn:foo:baz',
    })

    // then
    expect(job).toMatchSnapshot()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })
})
