
const colors = [
  '#EF9A9A',
  '#F48FB1',
  '#CE93D8',
  '#B39DDB',
  '#9FA8DA',
  '#90CAF9',
  '#81D4FA',
  '#80DEEA',
  '#80CBC4',
  '#A5D6A7',
  '#C5E1A5',
  '#E6EE9C',
  '#FFF59D',
  '#FFE082',
  '#FFCC80',
  '#FFAB91',
  '#BCAAA4',
  '#EEEEEE',
  '#B0BEC5'
]

/**
 * Get "random" color for a string. Consistently returns the same color for
 * the same string.
 */
export function getColor (str: string): string {
  return colors[hash(str) % colors.length]
}

// Stolen from https://github.com/darkskyapp/string-hash
function hash (str: string) {
  let hash = 5381
  let i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  // JavaScript does bitwise operations (like XOR, above) on 32-bit signed
  // integers. Since we want the results to be always positive, convert the
  // signed int to an unsigned by doing an unsigned bitshift.
  return hash >>> 0
}
