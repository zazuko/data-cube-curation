export interface AttributeEvents {
  ValueAttributeAdded: {
    tableId: string;
    columnId: string;
    propertyTemplate: string;
    datatype: string;
    language?: string;
    parameters: {
      format?: string;
      default?: string;
    };
  };
  ReferenceAttributeAdded: {
    tableId: string;
    propertyTemplate: string;
    referencedTableId: string;
    columnMappings: {
      sourceColumnId: string;
      referencedColumnId: string;
    }[];
  };
}
