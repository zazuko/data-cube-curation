import { ResourceFactory } from '@tpluscode/rdfine'
import { ProjectMixin } from './Project'
import { DimensionTableMixin } from './Table/Table'
import { SourceMixin } from './Source'
import Attributes from './Table/Attribute'
import { ColumnMixin } from './Table/Column'
import { ColumnMappingMixin } from './Table/ColumnMapping'

export default function (factory: ResourceFactory) {
  [
    ...Attributes,
    ProjectMixin,
    DimensionTableMixin,
    SourceMixin,
    ColumnMixin,
    ColumnMappingMixin,
  ].forEach(m => factory.addMixin(m))
}
