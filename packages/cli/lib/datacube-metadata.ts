import path from 'path'
import fs from 'fs'
import through from 'through2'
import reduce from 'through2-reduce'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import getStream from 'get-stream'
import { Context } from 'barnard59-core/lib/Pipeline'
import toReadable from 'barnard59-base/lib/toReadable'
import { qb, rdf } from '@tpluscode/rdf-ns-builders'
import * as S3 from './s3'

const filename = 'datacube-metadata.ttl'

export function openFile (this: Context, sourceDir: string) {
  const filePath = path.resolve(sourceDir, filename)

  if (fs.existsSync(filePath)) {
    return fs.createReadStream(filePath)
  } else {
    this.log.warn('Datacube metadata file not found')
    return toReadable.string('')
  }
}

export async function openFileFromS3 (this: Context, s3Endpoint: string, s3Bucket: string) {
  this.log.info(`Opening file ${filename} from S3`)

  const stream = S3.getFileStream(s3Endpoint, s3Bucket, filename)

  let content
  try {
    content = await getStream(stream)
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      this.log.warn('Datacube metadata file not found')
      content = ''
    } else {
      if (error.stack) {
        this.log.error(error.stack)
      }
      throw new Error(`Error reading file "${filename}" from S3`)
    }
  }

  return toReadable.string(content)
}

export function accumulateToDataset () {
  return reduce({ objectMode: true }, (dataset, quad) => {
    dataset.add(quad)
    return dataset
  }, $rdf.dataset())
}

// Generate proper qb:DataSet metadata
export function generate () {
  return through.obj(function (this, dataset, encoding, callback) {
    const cf = clownface({ dataset })
    let datacube = cf.namedNode(qb.DataSet).in(rdf.type).term

    if (!datacube) {
      datacube = cf.namedNode(qb.DataSet).addIn(rdf.type, cf.blankNode()).term
    }

    const structure = cf.namedNode(datacube as any)
      .addOut(qb.structure, cf.blankNode())
      .out(qb.structure)
      .addOut(rdf.type, qb.DataStructureDefinition)
      .term

    cf.node(qb.MeasureProperty).in(rdf.type).forEach((measure) => {
      const component = cf.blankNode().term
      cf.node(structure as any)
        .addOut(qb.component, component)
      cf.node(component)
        .addOut(rdf.type, qb.ComponentSpecification)
        .addOut(qb.measure, measure.term)
    })

    cf.node(qb.DimensionProperty).in(rdf.type).forEach((dimension) => {
      const component = cf.blankNode().term
      cf.node(structure as any)
        .addOut(qb.component, component)
      cf.node(component)
        .addOut(rdf.type, qb.ComponentSpecification)
        .addOut(qb.dimension, dimension.term)
    })

    cf.node(qb.AttributeProperty).in(rdf.type).forEach((attribute) => {
      const component = cf.blankNode().term
      cf.node(structure as any)
        .addOut(qb.component, component)
      cf.node(component)
        .addOut(rdf.type, qb.ComponentSpecification)
        .addOut(qb.attribute, attribute.term)
    })

    for (const quad of dataset) {
      this.push(quad)
    }

    callback()
  })
}

export function linkObservationsToDataset (this: Context) {
  const context = this // eslint-disable-line @typescript-eslint/no-this-alias

  return through.obj(function (this: any, quad, encoding, callback) {
    // Intercept qb:DataSet node and store it in a variable
    if (quad.predicate.equals(rdf.type) && quad.object.equals(qb.DataSet)) {
      context.variables.set('datacubeNode', quad.subject)
    }

    // Link observations to the previously intercepted qb:DataSet
    if (quad.predicate.equals(rdf.type) && quad.object.equals(qb.Observation)) {
      const datacube = context.variables.get('datacubeNode')

      if (!datacube) {
        throw new Error('`qb:DataSet` not found in datacube metadata')
      }

      this.push($rdf.quad(quad.subject, qb.dataSet, datacube))
    }

    this.push(quad)

    callback()
  })
}
