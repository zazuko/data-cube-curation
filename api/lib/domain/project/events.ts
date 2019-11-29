export interface ProjectEvents {
  ProjectCreated: {
    name: string;
  };
  ProjectRenamed: {
    name: string;
  };
  ProjectArchived: null;
  FactTableSourceSelected: {
    sourceId: string;
    tableName: string;
  };
  FactTableUnselected: {
    previousSourceId: string;
  };
}
