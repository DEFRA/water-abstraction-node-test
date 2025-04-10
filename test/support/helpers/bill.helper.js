/**
 * @module BillingHelper
 */

import BillModel from '../../../app/models/bill.model.js'
import { generateAccountNumber } from './billing-account.helper.js'
import { generateUUID } from '../../../app/lib/general.lib.js'

/**
 * Add a new bill
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `billingAccountId` - [random UUID]
 * - `address` - {}
 * - `accountNumber` - [randomly generated - T12345678A]
 * - `billRunId` - [random UUID]
 * - `financialYearEnding` - 2023
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:BillModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return BillModel.query()
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
    billingAccountId: generateUUID(),
    address: {},
    accountNumber: generateAccountNumber(),
    billRunId: generateUUID(),
    financialYearEnding: 2023
  }

  return {
    ...defaults,
    ...data
  }
}
