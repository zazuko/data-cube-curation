export interface ProjectEvents {
  ProjectCreated: {
    name: string;
  };
  ProjectRenamed: {
    name: string;
  };
  ProjectArchived: object;
  FactTableSourceSelected: {
    sourceId: string;
    tableName: string;
  };
  FactTableUnselected: {
    previousSourceId: string;
  };
}
