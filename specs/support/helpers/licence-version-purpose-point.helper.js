/**
 * @module LicenceVersionPurposePointHelper
 */

import { generateUUID } from '../../../app/lib/general.lib.js'
import { randomInteger } from '../general.js'
import LicenceVersionPurposePointModel from '../../../app/models/licence-version-purpose-point.model.js'
import { generateNaldPointId } from './point.helper.js'

/**
 * Add a new licence version purpose point
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `externalId` - [randomly generated - 9:99999:100414]
 * - `licenceVersionPurposeId` - [random UUID]
 * - `pointId - [random UUID]
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:LicenceVersionPurposePointModel>} The instance of the newly created record
 */
export async function add (data = {}) {
  const insertData = defaults(data)

  return LicenceVersionPurposePointModel.query()
    .insert({ ...insertData })
    .returning('*')
}

/**
 * Returns the defaults used
 *
 * It will override or append to them any data provided. Mainly used by the `add()` method, we make it available
 * for use in tests to avoid having to duplicate values.
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {object} - Returns the set defaults with the override data spread
 */
export function defaults (data = {}) {
  const defaults = {
    externalId: generateLicenceVersionPurposePointExternalId(),
    licenceVersionPurposeId: generateUUID(),
    pointId: generateUUID()
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * Returns a randomly generated licence version purpose point external ID (9:100:1)
 *
 * Combines IDs found in `NALD_ABS_PURP_POINTS` which is the basis for licence version purpose points.
 *
 * - `[region code]:[licence version purpose ID]:[point ID]` - all values are NALD IDs
 *
 * @returns {string} - A randomly generated licence version purpose point external ID
 */
export function generateLicenceVersionPurposePointExternalId () {
  const naldPointId = generateNaldPointId()

  return `9:${randomInteger(100, 99999)}:${naldPointId}`
}