/**
 * @module ReturnCycleHelper
 */

import { selectRandomEntry } from '../general.js'
import { generateUUID, timestampForPostgres } from '../../../app/lib/general.lib.js'
import ReturnCycleModel from '../../../app/models/return-cycle.model.js'
import { data as returnCycles } from '../../../db/seeds/data/return-cycles.js'

export const data = returnCycles

/**
 * Add a new return cycle
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `id` - [random UUID]
 * - `dueDate` - 2023-04-28
 * - `startDate` - 2023-04-28
 * - `endDate` - 2023-03-31
 * - `summer` - false
 * - `submittedInWrls` - true
 * - `createdAt` - new Date()
 * - `updatedAt` - new Date()
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:ReturnLogModel>} The instance of the newly created record
 */
export function add(data = {}) {
  const insertData = defaults(data)

  return ReturnCycleModel.query()
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
  const timestamp = timestampForPostgres()

  const defaults = {
    id: generateUUID(),
    createdAt: timestamp,
    dueDate: new Date('2023-04-28'),
    endDate: new Date('2023-03-31'),
    submittedInWrls: false,
    summer: false,
    startDate: new Date('2022-04-01'),
    updatedAt: timestamp
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * Select an entry from the reference data entries seeded at the start of testing
 *
 * Because this helper is linked to a reference record instead of a transaction, we don't expect these to be created
 * when using the service.
 *
 * So, they are seeded automatically when tests are run. Tests that need to link to a record can use this method to
 * select a specific entry, or have it return one at random.
 *
 * @param {number} [index=-1] - The reference entry to select. Defaults to -1 which means an entry will be returned at
 * random from the reference data
 *
 * @returns {object} The selected reference entry or one picked at random
 */
export function select(index = -1) {
  if (index > -1) {
    return returnCycles[index]
  }

  return selectRandomEntry(returnCycles)
}
