import CsvwMappingMixin from '@rdfine/csvw/Csvw'
import { ProjectMixin } from './Project'
import { TableMixin, FactTableMixin, DimensionTableMixin } from './Table/Table'
import { CsvSourceMixin, SourceMixin } from './Source'
import Attributes from './Table/Attribute'
import { ColumnMixin } from './Table/Column'
import { ColumnMappingMixin } from './Table/ColumnMapping'

export function wireUp (factory: any) {
  [
    ...Attributes,
    ProjectMixin,
    TableMixin,
    FactTableMixin,
    DimensionTableMixin,
    SourceMixin,
    CsvSourceMixin,
    ColumnMixin,
    ColumnMappingMixin,
    CsvwMappingMixin,
  ].forEach(m => factory.addMixin(m))
}
