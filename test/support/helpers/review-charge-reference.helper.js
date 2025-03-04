/**
 * @module ReviewChargeReferenceHelper
 */

import { generateUUID } from '../../../app/lib/general.lib.js'
import ReviewChargeReferenceModel from '../../../app/models/review-charge-reference.model.js'

/**
 * Add a new review charge reference record for 2pt matching
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `reviewChargeVersionId` - [random UUID]
 * - `chargeReferenceId` - [random UUID]
 * - `aggregate` - 1
 * - `amendedAggregate` - 1
 * - `canalAndRiverTrustAgreement` - false
 * - `twoPartTariffAgreement` - true
 * - `winterDiscount` - false
 * - `abatementAgreement` - 1
 * - `chargeAdjustment - 1
 * - `amendedChargeAdjustment` - 1
 * - `authorisedVolume` - 50
 * - `amendedAuthorisedVolume` - 50
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:ReviewChargeReferenceModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return ReviewChargeReferenceModel.query()
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
    reviewChargeVersionId: generateUUID(),
    chargeReferenceId: generateUUID(),
    aggregate: 1,
    amendedAggregate: 1,
    canalAndRiverTrustAgreement: false,
    twoPartTariffAgreement: true,
    winterDiscount: false,
    abatementAgreement: 1,
    chargeAdjustment: 1,
    amendedChargeAdjustment: 1,
    authorisedVolume: 50,
    amendedAuthorisedVolume: 50
  }

  return {
    ...defaults,
    ...data
  }
}
