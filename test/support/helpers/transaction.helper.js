/**
 * @module TransactionHelper
 */

import { select as ChargeCategorySelector } from './charge-category.helper.js'
import { determineCurrentFinancialYear, generateUUID } from '../../../app/lib/general.lib.js'
import TransactionModel from '../../../app/models/transaction.model.js'

/**
 * Add a new transaction
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `adjustmentFactor` - 1
 * - `aggregateFactor` - 1
 * - `authorisedDays` - 365
 * - `authorisedQuantity` - 11
 * - `billableDays` - 365
 * - `billableQuantity` - 11
 * - `billLicenceId` - [random UUID]
 * - `chargeCategoryCode` - [randomly generated - 4.4.5]
 * - `chargeCategoryDescription` - Medium loss, non-tidal, restricted water, up to and including 25 ML/yr, Tier 2 model
 * - `chargeReferenceId` - [random UUID]
 * - `chargeType` - standard,
 * - `description` - Water abstraction charge: Agriculture other than spray irrigation at East Rudham
 * - `credit` - false
 * - `endDate` - end date for the current financial year (31-MAR-20??)
 * - `loss` - medium
 * - `purposes` - [{}]
 * - `season` - all year
 * - `section130Agreement` - false
 * - `scheme` - sroc
 * - `source` - non-tidal
 * - `startDate` - start date for the current financial year (01-APR-20??)
 * - `volume` - 11
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:TransactionModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return TransactionModel.query()
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
  const { startDate, endDate } = determineCurrentFinancialYear()
  const { reference, shortDescription } = ChargeCategorySelector()

  const defaults = {
    adjustmentFactor: 1,
    aggregateFactor: 1,
    authorisedDays: 365,
    authorisedQuantity: 11,
    billableDays: 365,
    billableQuantity: 11,
    billLicenceId: generateUUID(),
    chargeCategoryCode: reference,
    chargeCategoryDescription: shortDescription,
    chargeReferenceId: generateUUID(),
    chargeType: 'standard',
    credit: false,
    description: 'Water abstraction charge: Agriculture other than spray irrigation at East Rudham',
    endDate,
    loss: 'medium',
    purposes: [{}],
    season: 'all year',
    section130Agreement: 'false',
    scheme: 'sroc',
    source: 'non-tidal',
    startDate,
    volume: 11
  }

  return {
    ...defaults,
    ...data
  }
}
