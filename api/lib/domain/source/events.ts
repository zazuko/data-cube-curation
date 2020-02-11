import { handler } from '@tpluscode/fun-ddr'

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

export default {
  sourceEvents: handler<SourceEvents>(),
}
