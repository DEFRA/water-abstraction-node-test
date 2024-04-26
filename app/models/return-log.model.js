/**
 * Model for return_logs (returns.returns)
 * @module ReturnLogModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import ReturnSubmissionModel from './return-submission.model.js'

export default class ReturnLogModel extends BaseModel {
  static get tableName () {
    return 'returnLogs'
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes () {
    return [
      'metadata'
    ]
  }

  static get relationMappings () {
    return {
      returnSubmissions: {
        relation: Model.HasManyRelation,
        modelClass: ReturnSubmissionModel,
        join: {
          from: 'returnLogs.id',
          to: 'returnSubmissions.returnLogId'
        }
      }
    }
  }
}
