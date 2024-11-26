/**
 * @module LicenceVersionPurposeConditionHelper
 */

import { generateUUID, timestampForPostgres } from '../../../app/lib/general.lib.js'
import { randomInteger } from '../general.js'
import LicenceVersionPurposeConditionModel from '../../../app/models/licence-version-purpose-condition.model.js'
import { select as LicenceVersionPurposeConditionTypeSelector } from './licence-version-purpose-condition-type.helper.js'

/**
 * Add a new licence version purpose condition
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `licenceVersionPurposeConditionId` - [random UUID]
 * - `licenceVersionPurposeId` - [random UUID]
 * - `licenceVersionPurposeConditionTypeId` - [randomly selected UUID from licence version purpose condition types]
 * - `externalId` - [9:${randomInteger(10000, 99999)}:1:0]
 * - `source` - [nald]
 * - `dateCreated` - new Date()
 * - `dateUpdated` - new Date()
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:LicenceVersionPurposeConditionModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return LicenceVersionPurposeConditionModel.query()
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
  const { id: licenceVersionPurposeConditionTypeId } = LicenceVersionPurposeConditionTypeSelector()
  const timestamp = timestampForPostgres()

  const defaults = {
    licenceVersionPurposeId: generateUUID(),
    licenceVersionPurposeConditionTypeId,
    externalId: `9:${randomInteger(10000, 99999)}:1:0`,
    source: 'nald',
    createdAt: timestamp,
    updatedAt: timestamp
  }

  return {
    ...defaults,
    ...data
  }
}
