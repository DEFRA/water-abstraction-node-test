/**
 * @module ReviewChargeVersionHelper
 */

import { generateUUID } from '../../../app/lib/general.lib.js'
import ReviewChargeVersionModel from '../../../app/models/review-charge-version.model.js'

/**
 * Add a new review charge version record for 2pt matching
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `reviewLicenceId` - [random UUID]
 * - `chargeVersionId` - [random UUID]
 * - `changeReason` - Strategic review of charges (SRoC)
 * - `chargePeriodStartDate` - 2022-04-01
 * - `chargePeriodEndDate` - 2022-06-05
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:ReviewChargeVersionModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return ReviewChargeVersionModel.query()
    .insert({ ...insertData })
    .returning('*')
}

/**
 * Returns the defaults used
 *
 * It will override or append to them any data provided. Mainly used by the `add()` method, we make it available
 * for use in tests to avoid having to duplicate values.
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here in the database
 *
 * @returns {object} - Returns data from the query
 */
export function defaults(data = {}) {
  const defaults = {
    reviewLicenceId: generateUUID(),
    chargeVersionId: generateUUID(),
    changeReason: 'Strategic review of charges (SRoC)',
    chargePeriodStartDate: new Date('2022-04-01'),
    chargePeriodEndDate: new Date('2022-06-05')
  }

  return {
    ...defaults,
    ...data
  }
}
