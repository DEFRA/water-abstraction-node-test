/**
 * @module UserHelper
 */

import { randomInteger, selectRandomEntry } from '../general.js'
import { generateUUID } from '../../../app/lib/general.lib.js'
import UserModel from '../../../app/models/user.model.js'
import { data as users } from '../../../db/seeds/data/users.js'

export const DEFAULT_INDEX = 4

/**
 * Add a new user
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `username` - [random UUID]@wrls.gov.uk
 * - `password` - P@55word (note that this is salted and hashed before being persisted)
 * - `resetRequired` - 0
 * - `badLogins` - 0
 * - `application` - water_admin
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:UserModel>} The instance of the newly created record
 */
export async function add (data = {}) {
  const insertData = defaults(data)

  // Overwrite the current password with the hashed version we want to persist
  insertData.password = UserModel.generateHashedPassword(insertData.password)

  return UserModel.query()
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
  const defaults = {
    username: `${generateUUID()}@wrls.gov.uk`,
    password: 'P@55word',
    resetRequired: 0,
    badLogins: 0,
    application: 'water_admin'
  }

  return {
    ...defaults,
    ...data
  }
}

/**
 * Generates a random user ID
 *
 * @returns {number} a random integer between 100011 and 199999
 */
export function generateUserId () {
  // The last ID in the pre-seeded users is 100010
  return randomInteger(100011, 199999)
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
export function select (index = -1) {
  if (index > -1) {
    return users[index]
  }

  return selectRandomEntry(users)
}
