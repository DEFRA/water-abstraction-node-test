/**
 * @module ScheduledNotificationHelper
 */

import { timestampForPostgres } from '../../../app/lib/general.lib.js'
import ScheduledNotificationModel from '../../../app/models/scheduled-notification.model.js'

/**
 * Add a new scheduled notification
 *
 * If no `data` is provided, default values will be used. These are
 *
 * - `createdAt` - new Date()
 *
 * @param {object} [data] - Any data you want to use instead of the defaults used here or in the database
 *
 * @returns {Promise<module:ScheduledNotificationModel>} The instance of the newly created record
 */
export async function add(data = {}) {
  const insertData = defaults(data)

  return ScheduledNotificationModel.query()
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
    // INFO: The table does not have a default for the createdAt column.
    createdAt: timestampForPostgres()
  }

  return {
    ...defaults,
    ...data
  }
}
