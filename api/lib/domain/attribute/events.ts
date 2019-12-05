export interface AttributeEvents {
  ValueAttributeAdded: {
    tableId: string;
    columnId: string;
    predicate: string;
    datatype: string;
    language: string;
  };
}
