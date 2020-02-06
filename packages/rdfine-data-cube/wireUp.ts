import { ResourceFactory } from '@tpluscode/rdfine'
import CsvwMappingMixin from '@rdfine/csvw/Csvw'
import { ProjectMixin } from './Project'
import { DimensionTableMixin, TableMixin } from './Table/Table'
import { SourceMixin } from './Source'
import Attributes from './Table/Attribute'
import { ColumnMixin } from './Table/Column'
import { ColumnMappingMixin } from './Table/ColumnMapping'

export function wireUp (factory: ResourceFactory) {
  [
    ...Attributes,
    ProjectMixin,
    TableMixin,
    DimensionTableMixin,
    SourceMixin,
    ColumnMixin,
    ColumnMappingMixin,
    CsvwMappingMixin,
  ].forEach(m => factory.addMixin(m))
}
