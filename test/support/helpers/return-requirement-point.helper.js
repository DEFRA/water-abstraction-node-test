/**
 * @module ReturnRequirementPointHelper
 */

import { generateUUID } from '../../../app/lib/general.lib.js'
import { randomInteger } from '../general.js'
import { generateNaldPointId } from './point.helper.js'
import ReturnRequirementPointModel from '../../../app/models/return-requirement-point.model.js'

/**
 * Add a new return requirement point
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `externalId` - [randomly generated - 9:99999:100414]
 * - `pointId - [random UUID]
 * - `returnRequirementId` - [random UUID]
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:ReturnRequirementPointModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return ReturnRequirementPointModel.query()
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
export function defaults(data = {}) {
  const defaults = {
    externalId: generateReturnRequirementPointExternalId(),
    pointId: generateUUID(),
    returnRequirementId: generateUUID()
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * Returns a randomly generated return requirement point external ID (9:100:1)
 *
 * Combines IDs found in `NALD_RET_FMT_POINTS` which is the basis for return requirements points.
 *
 * - `[region code]:[return requirement ID]:[point ID]` - all values are NALD IDs
 *
 * @returns {string} - A randomly generated return requirement point external ID
 */
export function generateReturnRequirementPointExternalId() {
  const naldPointId = generateNaldPointId()

  return `9:${randomInteger(100, 99999)}:${naldPointId}`
}