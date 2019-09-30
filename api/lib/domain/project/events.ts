export interface ProjectEvents {
  ProjectCreated: {
    name: string;
  };
  ProjectRenamed: {
    name: string;
  };
  ProjectArchived: object;
}
