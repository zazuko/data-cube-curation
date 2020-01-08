export interface ProjectEvents {
  ProjectCreated: {
    name: string;
    baseUri: string;
  };
  ProjectRenamed: {
    name: string;
  };
  ProjectRebased: {
    baseUri: string;
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
