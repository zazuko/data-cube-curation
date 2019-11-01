export interface AttributeEvents {
  AttributeAdded: {
    tableId: string
    name: string
    columnId: string
    predicate: string
    datatype: string
    language: string
  }
}
