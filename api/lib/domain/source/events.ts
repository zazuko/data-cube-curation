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

export interface CsvSourceEvents extends SourceEvents {
  NameChanged: {
    newName: string;
  };
  QuoteChanged: {
    newQuote: string;
  };
  DelimiterChanged: {
    newDelimiter: string;
  };
}

export default {
  sourceEvents: handler<SourceEvents>(),
  csvSourceEvents: handler<CsvSourceEvents>(),
}
