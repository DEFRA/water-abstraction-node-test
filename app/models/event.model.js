/**
 * Model for events (water.events)
 * @module EventModel
 */

import BaseModel from './base.model.js'

export default class EventModel extends BaseModel {
  static get tableName() {
    return 'events'
  }
}
