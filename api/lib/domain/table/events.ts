import { handler } from '@tpluscode/fun-ddr'

export interface TableEvents {
  FactTableCreated: {
    projectId: string;
    sourceId: string;
    tableName: string;
    identifierTemplate: string | null;
  };
  DimensionTableCreated: {
    projectId: string;
    sourceId: string;
    tableName: string;
    identifierTemplate: string;
  };
  TableArchived: {
    projectId: string;
    isFactTable: boolean;
  };
  TableIdentifierTemplateChanged: {
    identifierTemplate: string | null;
  };
  TableNameChanged: {
    name: string;
  };
}

export default handler<TableEvents>()
