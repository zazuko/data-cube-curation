export interface TableEvents {
  FactTableCreated: {
    projectId: string;
    sourceId: string;
  };
  DimensionTableCreated: {
    projectId: string;
    sourceId: string;
    identifierTemplate: string;
  };
}
