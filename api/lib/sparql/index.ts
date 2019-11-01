import { SelectBuilder } from './SelectBuilder'
import { AskBuilder } from './AskBuilder'
import { ConstructBuilder } from './ConstructBuilder'
import { InsertDataBuilder } from './InsertDataBuilder'
import { DeleteInsertBuilder } from './DeleteInsertBuilder'
import { DescribeBuilder } from './DescribeBuilder'

export function construct() {
  return new ConstructBuilder()
}

export function select(...variables: string[]) {
  return new SelectBuilder().variables(...variables)
}

export function ask(...patterns: string[]) {
  return new AskBuilder().where(...patterns)
}

export function insertData(...data: string[]) {
  return new InsertDataBuilder().graph(...data)
}

export function deleteInsert(...deletePatterns: string[]) {
  return new DeleteInsertBuilder().delete(...deletePatterns)
}

export function describe(idOrVariable: string, ...idOrVariables: string[]) {
  return new DescribeBuilder(idOrVariable, idOrVariables)
}
