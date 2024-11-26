/**
 * @module LicenceAgreementHelper
 */

import { select as FinancialAgreementSelector } from './financial-agreement.helper.js'
import LicenceAgreementModel from '../../../app/models/licence-agreement.model.js'
import { generateLicenceRef } from './licence.helper.js'

/**
 * Add a new licence agreement
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `financialAgreementId` - [randomly selected UUID from financial agreements]
 * - `licenceRef` - [randomly generated - 01/123]
 * - `startDate` - 2023-01-01
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:LicenceAgreementModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return LicenceAgreementModel.query()
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
  const { id: financialAgreementId } = FinancialAgreementSelector()

  const defaults = {
    financialAgreementId,
    licenceRef: generateLicenceRef(),
    startDate: new Date('2023-01-01')
  }

  return {
    ...defaults,
    ...data
  }
}
