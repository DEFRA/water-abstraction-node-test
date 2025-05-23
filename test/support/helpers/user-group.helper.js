/**
 * @module UserGroupHelper
 */

import { generateUUID } from '../../../app/lib/general.lib.js'
import { selectRandomEntry } from '../general.js'
import { generateUserId } from './user.helper.js'
import { select as GroupSelector } from './group.helper.js'
import UserGroupModel from '../../../app/models/user-group.model.js'
import { data as userGroups } from '../../../db/seeds/data/user-groups.js'

export const DEFAULT_INDEX = 4

export const data = userGroups

/**
 * Add a new user group
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `userId` - [randomly generated - 100001]
 * - `groupId` - [randomly selected UUID from groups]
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:UserGroupModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return UserGroupModel.query()
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
  const { id: groupId } = GroupSelector()

  const defaults = {
    // We create a random uuid as the id is NOT generated by the db, unlike most other tables
    id: generateUUID(),
    userId: generateUserId(),
    groupId
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
    return userGroups[index]
  }

  return selectRandomEntry(userGroups)
}
