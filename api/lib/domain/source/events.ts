export interface SourceEvents {
  CsvSourceUploaded: {
    projectId: string;
    fileName: string;
    columns: string[];
    sampleRows: string[][];
    quote: string;
    delimiter: string;
  };
}
