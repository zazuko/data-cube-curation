import { handler } from '@tpluscode/fun-ddr'

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

export default handler<ProjectEvents>()
