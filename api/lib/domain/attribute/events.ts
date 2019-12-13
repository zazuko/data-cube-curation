export interface AttributeEvents {
  ValueAttributeAdded: {
    tableId: string;
    columnId: string;
    predicate: string;
    datatype?: string;
    language?: string;
  };
  ReferenceAttributeAdded: {
    tableId: string;
    predicate: string;
    referencedTableId: string;
    columnMappings: {
      sourceColumnId: string;
      referencedColumnId: string;
    }[];
  };
}
