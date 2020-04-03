
/**
 * Replace (non-mutating) an item in an array or push it at the end if the item
 * was not in the original array.
 *
 * @param array - Original array.
 * @param newItem - Item to insert in the array.
 * @param areEqual - Comparison function to detect which item to replace.
 */
export function replaceOrAdd<T> (array: T[], newItem: T, areEqual: (t1: T, t2: T) => Boolean): T[] {
  const newArray = []
  let found = false

  for (const item of array) {
    if (areEqual(item, newItem)) {
      newArray.push(newItem)
      found = true
    } else {
      newArray.push(item)
    }
  }

  if (!found) {
    newArray.push(newItem)
  }

  return newArray
}
