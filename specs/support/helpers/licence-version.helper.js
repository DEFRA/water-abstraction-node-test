/**
 * @module LicenceVersionHelper
 */

import { generateUUID, timestampForPostgres } from '../../../app/lib/general.lib.js'
import LicenceVersionModel from '../../../app/models/licence-version.model.js'
import { randomInteger } from '../general.js'

/**
 * Add a new licence version
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `licenceId` - [random UUID]
 * - `issue` - 1
 * - `increment` - 0
 * - `status` - 'current'
 * - `startDate` - new Date('2022-01-01')
 * - `externalId` - [randomly generated - 9:99999:1:0]
 * - `createdAt` - new Date()
 * - `updatedAt` - new Date()
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:LicenceVersionModel>} The instance of the newly created record
 */
export async function add (data = {}) {
  const insertData = defaults(data)

  return LicenceVersionModel.query()
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
  const timestamp = timestampForPostgres()

  const defaults = {
    licenceId: generateUUID(),
    issue: 1,
    increment: 0,
    status: 'current',
    startDate: new Date('2022-01-01'),
    externalId: generateLicenceVersionExternalId(),
    createdAt: timestamp,
    updatedAt: timestamp
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * Returns a randomly generated externalId for a licence version
 *
 * @returns {string} - A randomly generated externalId
 */
export function generateLicenceVersionExternalId () {
  return `${randomInteger(0, 9)}:${randomInteger(10000, 99999)}:${randomInteger(1, 100)}:0`
}
