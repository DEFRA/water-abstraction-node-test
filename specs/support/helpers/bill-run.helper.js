/**
 * @module BillRunHelper
 */

import BillRunModel from '../../../app/models/bill-run.model.js'
import { select as RegionSelector } from './region.helper.js'

/**
 * Add a new bill run
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `regionId` - [randomly selected UUID from regions]
 * - `batchType` - supplementary
 * - `fromFinancialYearEnding` - 2023
 * - `toFinancialYearEnding` - 2023
 * - `status` - queued
 * - `scheme` - sroc
 * - `source` - wrls
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:BillRunModel>} The instance of the newly created record
 */
export async function add (data = {}) {
  const insertData = defaults(data)

  return BillRunModel.query()
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
  const { id: regionId } = RegionSelector()

  const defaults = {
    regionId,
    batchType: 'supplementary',
    fromFinancialYearEnding: 2023,
    toFinancialYearEnding: 2023,
    status: 'queued',
    scheme: 'sroc',
    source: 'wrls'
  }

  return {
    ...defaults,
    ...data
  }
}
