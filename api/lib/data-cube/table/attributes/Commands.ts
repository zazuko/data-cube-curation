import { NamedNode } from 'rdf-js'
import ns from '@rdfjs/namespace'
import { namespace, property, RdfResource, RdfResourceImpl } from '@tpluscode/rdfine'
import { expand } from '@zazuko/rdf-vocabularies'
import { dataCube, rdf } from '../../../namespaces'

const datatype = ns(expand('dataCube:datatype/'))

@namespace(dataCube)
class AddAttributeCommand extends RdfResourceImpl {
  public get propertyTemplate () {
    if (this._propertyTemplate) {
      return this._propertyTemplate.value
    }

    if (this.predicate) {
      return this.predicate.value
    }

    return undefined
  }

  @property({ path: 'propertyTemplate' })
  private _propertyTemplate!: NamedNode

  @property({ path: rdf.predicate })
  private predicate!: NamedNode
}

class DatatypeParameters extends RdfResourceImpl {
  @property.literal({
    path: datatype.format,
  })
  format?: string;

  @property.literal({
    path: datatype.default,
  })
  default?: string;
}

export class AddValueAttributeCommand extends AddAttributeCommand {
  public get datatype () {
    return this._datatype ? this._datatype.value : undefined
  }

  @property()
  public language: string;

  public get columnId () {
    return this.column ? this.column.value : undefined
  }

  @property.resource({
    path: datatype.parameters,
    as: [DatatypeParameters],
  })
  public parameters: DatatypeParameters;

  @property()
  private column?: NamedNode

  @property({ path: 'datatype' })
  private _datatype?: NamedNode;
}

@namespace(dataCube)
class ColumnMapping extends RdfResourceImpl {
  public get sourceColumnId () {
    return this.sourceColumn.id.value
  }

  public get referencedColumnId () {
    return this.referencedColumn.id.value
  }

  @property.resource()
  private sourceColumn!: RdfResource;

  @property.resource()
  private referencedColumn!: RdfResource;
}

export class AddReferenceAttributeCommand extends AddAttributeCommand {
  @property.resource({
    path: 'columnMapping',
    values: 'array',
    as: [ColumnMapping],
  })
  public columnMappings!: ColumnMapping[];

  public get referencedTableId () {
    return this.referencedTable.id.value
  }

  @property.resource()
  private referencedTable!: RdfResource
}
