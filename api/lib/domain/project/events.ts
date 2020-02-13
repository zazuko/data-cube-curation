import { handler } from '@tpluscode/fun-ddr'

export interface ProjectEvents {
  ProjectCreated: {
    name: string;
    baseUri: string;
    s3Bucket: string;
  };
  S3BucketChanged: {
    s3Bucket: string;
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
