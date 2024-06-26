/**
 * General support functions available to all tests
 * @module General
 */

/**
 * Generate a random integer within a range (inclusive)
 *
 * @param {Number} min lowest number (integer) in the range (inclusive)
 * @param {Number} max largest number (integer) in the range (inclusive)
 *
 * Credit https://stackoverflow.com/a/7228322
 *
 * @returns a number between min and max (inclusive)
 */
export function randomInteger (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
