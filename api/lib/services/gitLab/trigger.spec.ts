import { namedNode } from 'rdf-data-model'
import { triggerPipeline } from './trigger'
import fetch from 'node-fetch'
import env from '../../env'

jest.mock('node-fetch')
jest.mock('../../env')

const envMock = env as any as jest.SpyInstance
const fetchMock = fetch as any as jest.SpyInstance

describe('gitlab trigger', () => {
  beforeAll(() => {
    env.GITLAB_PIPELINE = 'GITLAB_PIPELINE'
    env.GITLAB_PIPELINE_TOKEN = 'GITLAB_PIPELINE_TOKEN'
    env.GITLAB_PIPELINE_BRANCH = 'master'
    env.AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID'
    env.AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY'
    env.AWS_S3_ENDPOINT = 'AWS_S3_ENDPOINT'
    env.GRAPH_STORE_ENDPOINT = 'GRAPH_STORE_ENDPOINT'
    env.GRAPH_STORE_USER = 'GRAPH_STORE_USER'
    env.GRAPH_STORE_PASSWORD = 'GRAPH_STORE_PASSWORD'
  })

  beforeEach(() => {
    fetchMock.mockReset()
  })

  afterAll(() => {
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
      triggerPipeline(project, {})
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
      triggerPipeline(project, {})
    }).toThrow()
  })

  it('calls gitlab trigger endpoint with project\'s settings', async () => {
    // given
    const project = {
      id: namedNode('foo:bar'),
      s3Bucket: 'foo',
      graphUri: 'urn:foo:bar',
    }

    // when
    await triggerPipeline(project, {})

    // then
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })

  it('calls gitlab trigger endpoint with overridden settings', async () => {
    // given
    const project = {
      id: namedNode('foo:bar'),
      s3Bucket: 'foo',
      graphUri: 'urn:foo:bar',
    }

    // when
    await triggerPipeline(project, {
      s3Bucket: 'changed bucket',
      graphUri: 'urn:foo:baz',
    })

    // then
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })
})
