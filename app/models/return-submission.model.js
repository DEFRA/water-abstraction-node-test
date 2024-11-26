/**
 * Model for return_submissions (returns.versions)
 * @module ReturnSubmissionModel
 */

import { Model } from 'objection'

import BaseModel from './base.model.js'

import ReturnSubmissionLineModel from './return-submission-line.model.js'
import ReturnLogModel from './return-log.model.js'

export default class ReturnSubmissionModel extends BaseModel {
  static get tableName() {
    return 'returnSubmissions'
  }

  // Defining which fields contain json allows us to insert an object without needing to stringify it first
  static get jsonAttributes() {
    return ['metadata']
  }

  static get relationMappings() {
    return {
      returnLog: {
        relation: Model.BelongsToOneRelation,
        modelClass: ReturnLogModel,
        join: {
          from: 'returnSubmissions.returnLogId',
          to: 'returnLogs.id'
        }
      },
      returnSubmissionLines: {
        relation: Model.HasManyRelation,
        modelClass: ReturnSubmissionLineModel,
        join: {
          from: 'returnSubmissions.id',
          to: 'returnSubmissionLines.returnSubmissionId'
        }
      }
    }
  }
}
