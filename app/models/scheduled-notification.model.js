/**
 * Model for scheduled_notifications (water.scheduled_notification)
 * @module ScheduledNotificationModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import EventModel from './event.model.js'

export default class ScheduledNotificationModel extends BaseModel {
  static get tableName() {
    return 'scheduledNotifications'
  }

  static get relationMappings() {
    return {
      event: {
        relation: Model.HasOneRelation,
        modelClass: EventModel,
        join: {
          from: 'scheduledNotifications.eventId',
          to: 'events.id'
        }
      }
    }
  }
}
