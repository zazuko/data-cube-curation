export interface SourceEvents {
  SourceUploaded: {
    projectId: string;
    fileName: string;
    columns: string[];
    sampleRows: string[][];
  };
}
