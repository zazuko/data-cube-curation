export interface AttributeEvents {
  AttributeAdded: {
    tableId: string;
    columnId: string;
    predicate: string;
    datatype: string;
    language: string;
  };
}
