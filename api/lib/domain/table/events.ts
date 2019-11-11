export interface TableEvents {
  FactTableCreated: {
    projectId: string;
    sourceId: string;
    tableName: string;
  };
  DimensionTableCreated: {
    projectId: string;
    sourceId: string;
    tableName: string;
    identifierTemplate: string;
  };
}
